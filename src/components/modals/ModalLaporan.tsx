"use client"
import { JSX, useState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Input from "@/components/forms/Input";
import Textarea from "../forms/Textarea";
import Button from "../buttons/Button";
import useUserProfile from "@/hooks/useUserProfile";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import InputFile from "../forms/InputFile";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/ReactQueryProvider";
import MapView from "../MapView";

type LaporanFormValues = {
    judul_laporan: string;
    deskripsi_laporan: string;
    foto_laporan: File | null;
    latitude?: number;
    longitude?: number;
}

type ModalLaporanReturn = {
    openModal: () => void;
}

type ModalLaporanProps = {
    children: (props: ModalLaporanReturn) => JSX.Element;
}

type LocationState = {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
}

export default function ModalLaporan({
    children,   
}: ModalLaporanProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        loading: false,
        error: null
    });

    const methods = useForm<LaporanFormValues>({
        mode: "onBlur",
        defaultValues: {
            judul_laporan: "",
            deskripsi_laporan: "",
            foto_laporan: null,
        },
    })
    const { user } = useUserProfile();
    const { handleSubmit } = methods;

    const openModal: ModalLaporanReturn = {
        openModal: () => setOpen(!open),
    }

    const getCurrentLocation = () => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                loading: false,
                error: "Geolocation tidak didukung oleh browser ini"
            }));
            toast.error("Geolocation tidak didukung oleh browser ini");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    loading: false,
                    error: null
                });
                toast.success("Lokasi berhasil didapatkan");
            },
            (error) => {
                let errorMessage = "Gagal mendapatkan lokasi";
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Akses lokasi ditolak. Silakan izinkan akses lokasi di browser Anda.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Informasi lokasi tidak tersedia";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Permintaan lokasi timeout";
                        break;
                }

                setLocation(prev => ({
                    ...prev,
                    loading: false,
                    error: errorMessage
                }));
                toast.error(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    useEffect(() => {
        if (open && !location.latitude && !location.longitude) {
            getCurrentLocation();
        }
    }, [open]);

    const { mutate } = useMutation({
        mutationFn: async (data: LaporanFormValues) => {
            const { data: user } = await supabase.auth.getUser();

            const file = data.foto_laporan;
            const fileExt = file?.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${user.user?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("foto-laporan") 
                .upload(filePath, file as Blob, {
                    cacheControl: "3600",
                    upsert: false,
                });
            
            if (uploadError) {
                throw new Error(uploadError.message);
            }

            const { data: lokasiData, error: lokasiError } = await supabase
                .from('lokasi')
                .insert([
                    { 
                        lat: location.latitude, 
                        long: location.longitude
                    }
                ])
                .select();

            if (lokasiError) {
                console.error('Error inserting lokasi:', lokasiError);
                return;
            }

            const idLokasiBaru = lokasiData[0].lokasi_id;


            const { error: insertError } = await supabase
                .from("laporan")
                .insert({
                    judul: data.judul_laporan,
                    deskripsi: data.deskripsi_laporan,
                    foto_laporan: filePath,
                    user_id: user.user?.id,
                    date: new Date().toISOString(),
                    status_bersih: false,
                    lokasi_id: idLokasiBaru
                });

            if (insertError) {
                throw new Error(insertError.message);
            }
        },
        onSuccess: () => {
            toast.success("Laporan berhasil diunggah!");
            setOpen(false);
            methods.reset();
            setLocation({
                latitude: null,
                longitude: null,
                loading: false,
                error: null
            });
            queryClient.invalidateQueries({ queryKey: ["laporan"] });
        },
        onError: (error) => {
            toast.error(`Gagal mengunggah laporan: ${error.message}`);
        }
    })

    const onSubmit: SubmitHandler<LaporanFormValues> = (data) => {
        if (!location.latitude || !location.longitude) {
            toast.error("Lokasi diperlukan untuk mengirim laporan");
            return;
        }

        const formDataWithLocation = {
            ...data,
            latitude: location.latitude,
            longitude: location.longitude
        };

        mutate(formDataWithLocation);
    }

    return (
        <>
            {children(openModal)}
            <dialog open={open}>
                <div className="fixed top-0 left-0 w-full flex justify-center items-center min-h-screen bg-black/35">
                    <FormProvider {...methods}>
                        <form
                            className="flex flex-col items-center border border-gray-main bg-white-main w-full max-w-[720px] p-5 mx-4 rounded-xl space-y-5 max-h-[90vh] overflow-y-auto" 
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div 
                                className="w-full flex justify-end cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <ArrowRight />
                            </div>

                            <Input 
                                id="judul_laporan"
                                label="Judul Laporan"
                                validation={{
                                    required: "Judul laporan tidak boleh kosong",
                                    minLength: {
                                        value: 5,
                                        message: "Judul laporan minimal 5 karakter",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Judul laporan maksimal 100 karakter",
                                    },
                                }}
                            />
                            <Textarea 
                                id="deskripsi_laporan"
                                label="Deskripsi Laporan"
                                validation={{
                                    required: "Deskripsi laporan tidak boleh kosong",
                                    minLength: {
                                        value: 10,
                                        message: "Deskripsi laporan minimal 10 karakter",
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: "Deskripsi laporan maksimal 500 karakter",
                                    },
                                }}
                            />

                            <InputFile 
                                id="foto_laporan"
                                label="Foto Laporan"
                                capture="environment"
                                requireSquare
                            />

                            {/* Location Section */}
                            <div className="w-full border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin size={18} />
                                        Lokasi Laporan
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={location.loading}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {location.loading ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Mendapatkan lokasi...
                                            </>
                                        ) : (
                                            'Refresh Lokasi'
                                        )}
                                    </button>
                                </div>
                                
                                {location.error && (
                                    <div className="text-red-600 text-sm mb-2">
                                        {location.error}
                                    </div>
                                )}
                                
                                {location.latitude && location.longitude ? (
                                    <>
                                        <div className="text-sm text-gray-600">
                                            <p>Latitude: {location.latitude.toFixed(6)}</p>
                                            <p>Longitude: {location.longitude.toFixed(6)}</p>
                                        </div>

                                        <MapView 
                                            latitude={location.latitude}
                                            longitude={location.longitude}
                                        />
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {location.loading ? 'Sedang mendapatkan lokasi...' : 'Lokasi belum didapatkan'}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <div className="flex items-center gap-4 hover:bg-white-secondary p-3 rounded-xl">
                                    <figure className="rounded-full w-[50px] h-[50px] bg-gray-main">
                                        
                                    </figure>
                                    
                                    <div className="flex flex-col">
                                        <p className="font-bold">{user?.user_name}</p>
                                        <p>{user?.peran}</p>
                                    </div>
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={!location.latitude || !location.longitude}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </dialog>
        </>
    );
}