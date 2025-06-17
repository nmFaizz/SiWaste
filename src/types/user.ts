export type UserData = {
    user_name: string;
    email: string;
    peran: UserPeran;
}

export type UserPeran = 
    | "Pelajar"
    | "Mahasiswa"
    | "Orang Tua"
    | "Anak / Remaja"