// ===== KONFIGURASI FRONTEND (aman untuk publik) =====
// Ganti dua nilai Supabase di bawah (Project Settings > API). JANGAN taruh service_role / Midtrans server key di sini.
window.CFG={
  URL:'https://rbylsamfswlplksvbvpo.supabase.co',
  KEY:'sb_publishable_5vBCoSp5r7tnODHtEJKGrg_EDmIeJr4',
// Pembayaran manual via DANA
  DANA:{
    number:'085298233011',
    name:'Mulyawati R. Asupu'
  },
// Kontak toko: isi yang ada saja, yang dikosongkan ('') otomatis disembunyikan.
  CONTACT:{whatsapp:'',email:'',instagram:''}
};