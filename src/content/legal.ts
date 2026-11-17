import type { L10n } from "@/i18n/config";

// DRAFT templates. Must be reviewed by a lawyer before any real use (CLAUDE.md §8).
type Doc = { heading: L10n; body: L10n }[];

export const terms: Doc = [
  {
    heading: { en: "1. Booking", id: "1. Pemesanan" },
    body: {
      en: "A booking is confirmed once the down payment (DP) is received. The lead traveller is responsible for the accuracy of all traveller data.",
      id: "Pemesanan dianggap terkonfirmasi setelah uang muka (DP) diterima. Pemesan utama bertanggung jawab atas kebenaran data seluruh peserta.",
    },
  },
  {
    heading: { en: "2. Down payment & balance", id: "2. DP & pelunasan" },
    body: {
      en: "A 30% DP secures your seat. The balance is due 14 days before departure (21 days for Flores). Bookings made closer to departure require full payment.",
      id: "DP 30% mengamankan kursi Anda. Pelunasan paling lambat 14 hari sebelum keberangkatan (21 hari untuk Flores). Pemesanan mendekati hari keberangkatan wajib dibayar lunas.",
    },
  },
  {
    heading: { en: "3. Cancellation by the traveller", id: "3. Pembatalan oleh peserta" },
    body: {
      en: "More than 30 days before departure: DP is non-refundable. 15–30 days: 50% of the total price. Less than 15 days or no-show: 100% of the total price.",
      id: "Lebih dari 30 hari sebelum keberangkatan: DP tidak dapat dikembalikan. 15–30 hari: 50% dari total harga. Kurang dari 15 hari atau tidak hadir: 100% dari total harga.",
    },
  },
  {
    heading: { en: "4. Reschedule", id: "4. Perubahan jadwal" },
    body: {
      en: "One free reschedule is allowed up to 21 days before departure, subject to availability. Price differences apply.",
      id: "Satu kali perubahan jadwal gratis diperbolehkan hingga 21 hari sebelum keberangkatan, tergantung ketersediaan. Selisih harga berlaku.",
    },
  },
  {
    heading: { en: "5. What is not included", id: "5. Yang tidak termasuk" },
    body: {
      en: "Meals, souvenirs, flights to the meeting point, personal expenses, tips and travel insurance are not included unless stated otherwise.",
      id: "Makan, oleh-oleh, tiket pesawat ke titik kumpul, pengeluaran pribadi, tip, dan asuransi perjalanan tidak termasuk kecuali disebutkan lain.",
    },
  },
  {
    heading: { en: "6. Force majeure", id: "6. Keadaan kahar" },
    body: {
      en: "If a trip cannot run because of natural disasters, volcanic activity, government closures or severe weather, we will offer a new date or an alternative itinerary of equal value.",
      id: "Jika trip tidak dapat berjalan karena bencana alam, aktivitas vulkanik, penutupan oleh pemerintah, atau cuaca ekstrem, kami akan menawarkan tanggal baru atau itinerary alternatif dengan nilai setara.",
    },
  },
];

export const privacy: Doc = [
  {
    heading: { en: "1. Data we collect", id: "1. Data yang kami kumpulkan" },
    body: {
      en: "Name, email, WhatsApp number, city, traveller names and age groups, and optionally ID numbers needed by hotels and parks.",
      id: "Nama, email, nomor WhatsApp, kota, nama dan kelompok usia peserta, serta nomor identitas (opsional) yang dibutuhkan hotel dan taman nasional.",
    },
  },
  {
    heading: { en: "2. Why we use it", id: "2. Tujuan penggunaan" },
    body: {
      en: "To process bookings, share data with partner hotels and transport providers, send trip reminders and handle payments.",
      id: "Untuk memproses pemesanan, berbagi data dengan hotel dan penyedia transportasi partner, mengirim pengingat trip, dan memproses pembayaran.",
    },
  },
  {
    heading: { en: "3. Your rights (UU PDP No. 27/2022)", id: "3. Hak Anda (UU PDP No. 27/2022)" },
    body: {
      en: "Under Indonesia's Personal Data Protection Law you may request access, correction or deletion of your data, and withdraw consent at any time by contacting us.",
      id: "Berdasarkan Undang-Undang Pelindungan Data Pribadi, Anda berhak meminta akses, perbaikan, atau penghapusan data, serta menarik persetujuan kapan saja dengan menghubungi kami.",
    },
  },
  {
    heading: { en: "4. Retention & security", id: "4. Penyimpanan & keamanan" },
    body: {
      en: "We keep booking data for as long as required by tax regulations and protect it with access controls and encryption in transit.",
      id: "Kami menyimpan data pemesanan selama diwajibkan peraturan perpajakan dan melindunginya dengan kontrol akses serta enkripsi saat transmisi.",
    },
  },
];
