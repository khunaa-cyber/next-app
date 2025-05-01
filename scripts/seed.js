const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// db holbolt
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dental-clinic";

// modeludig todorhoiloh
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "doctor", "admin"], default: "client" },
  phone: { type: String },
  address: { type: String },
  birthdate: { type: Date },
  gender: { type: String, enum: ["Эрэгтэй", "Эмэгтэй", "Бусад"] },
  allergies: { type: String },
  bloodType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String },
  education: { type: String },
  specialization: { type: String },
  bio: { type: String },
  image: { type: String },
  schedule: { type: String },
  languages: { type: String },
  services: [{ type: String }],
  branch: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  images: [{ type: String }],
  price: { type: String, required: true },
  duration: { type: String },
  benefits: [{ type: String }],
  recommendedFrequency: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// modeluudig uusgeh
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database successfully");

    // emch nariin ogogdol
    const doctors = [
      {
        name: "Д. Болормаа",
        position: "Ерөнхий шүдний эмч",
        experience: "15 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
        specialization: "Шүдний ломбо, цэвэрлэгээ, яаралтай тусламж",
        bio: "Д. Болормаа нь 15 жилийн туршлагатай ерөнхий шүдний эмч юм. Тэрээр АШУҮИС-ийг төгссөн бөгөөд шүдний ломбо, цэвэрлэгээ, яаралтай тусламж үзүүлэх чиглэлээр мэргэшсэн. Тэрээр үйлчлүүлэгчдэд найрсаг, тайван хандлагаараа алдартай бөгөөд шүдний эмчилгээг аль болох өвдөлтгүй, тав тухтай хийхийг эрмэлздэг.",
        image: "/images/doctor-1.jpg",
        schedule: "Даваа-Баасан: 09:00-17:00",
        languages: "Монгол, Англи",
        services: ["Шүдний цэвэрлэгээ", "Шүдний ломбо", "Шүдний үзлэг", "Яаралтай тусламж", "Шүдний өвчин оношлогоо"],
        branch: "Салбар 1",
      },
      {
        name: "Б. Батбаяр",
        position: "Шүдний мэс засалч",
        experience: "12 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний мэс заслын тэнхим",
        specialization: "Шүдний мэс засал, имплант, эрүүний гажиг",
        bio: "Б. Батбаяр нь 12 жилийн туршлагатай шүдний мэс засалч юм. Тэрээр АШУҮИС-ийг төгссөн бөгөөд шүдний мэс засал, имплант, эрүүний гажиг засах чиглэлээр мэргэшсэн. Тэрээр олон улсын хурал, семинарт тогтмол оролцдог бөгөөд шүдний мэс заслын орчин үеийн аргуудыг эзэмшсэн.",
        image: "/images/doctor-2.jpg",
        schedule: "Мягмар, Пүрэв: 09:00-18:00, Бямба: 10:00-14:00",
        languages: "Монгол, Англи, Орос",
        services: ["Шүдний мэс засал", "Шүдний имплант", "Эрүүний гажиг засал", "Шүдний суулгац", "Шүдний титэм, гүүр"],
        branch: "Салбар 2",
      },
    ];

    // uilchilgeenii ogogdol
    const services = [
      {
        title: "Шүдний цэвэрлэгээ",
        description: "Мэргэжлийн шүдний эмч нар таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална.",
        detailedDescription:
          "Шүдний цэвэрлэгээ нь шүдний эрүүл мэндийг хадгалах хамгийн чухал арга юм. Энэ үйлчилгээ нь шүдний өнгөн гадаргуу дээр үүссэн өнгөр, чулуу, толбыг арилгаж, шүдийг цэвэрлэж, гялалзуулдаг. Мэргэжлийн шүдний эмч нар тусгай багаж, тоног төхөөрөмж ашиглан таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална. Шүдний цэвэрлэгээг 6 сар тутамд хийлгэхийг зөвлөдөг.",
        images: ["/s-c1.jpg", "/s-c2.jpg", "/s-c3.jpg", "/s-c4.jpg"],
        price: "50,000₮-с эхэлнэ",
        duration: "30-60 минут",
        benefits: [
          "Шүдний өнгөр, чулуу арилгана",
          "Шүдний өнгийг сайжруулна",
          "Амны үнэрийг багасгана",
          "Буйлны өвчнөөс сэргийлнэ",
          "Шүдний цоорлоос урьдчилан сэргийлнэ",
        ],
        recommendedFrequency: "6 сар тутамд",
      },
      {
        title: "Шүдний ломбо",
        description: "Орчин үеийн материал ашиглан шүдний цоорлыг засаж, шүдний анхны хэлбэр, үүргийг сэргээнэ.",
        detailedDescription:
          "Шүдний ломбо нь шүдний цоорол, гэмтлийг засах хамгийн түгээмэл арга юм. Энэ үйлчилгээ нь цоорсон шүдийг цэвэрлэж, орчин үеийн материал ашиглан шүдний анхны хэлбэр, үүргийг сэргээдэг. Манай эмнэлэг нь өндөр чанартай, удаан эдэлгээтэй, шүдний өнгөтэй ижил материалуудыг ашигладаг тул ломбо тавиулсан шүд нь бусад шүднээс ялгарахгүй.",
        images: ["/s-f1.jpg", "/s-f2.jpg", "/s-f3.jpg", "/s-f4.jpg"],
        price: "80,000₮-с эхэлнэ",
        duration: "30-90 минут",
        benefits: [
          "Шүдний цоорлыг арилгана",
          "Шүдний гэмтлийг засна",
          "Шүдний хэлбэр, үүргийг сэргээнэ",
          "Шүдний өвдөлтийг арилгана",
          "Шүдийг хадгалж үлдэхэд тусална",
        ],
        recommendedFrequency: "Шаардлагатай үед",
      },
    ];

    // FAQ ogogdol
    const faqItems = [
      {
        question: "Шүдний эмнэлэгт хэрхэн цаг захиалах вэ?",
        answer:
          "Та манай вэб сайтын 'Цаг захиалах' хэсгээр дамжуулан онлайнаар цаг захиалах боломжтой. Мөн 77007700 дугаарт залгаж цаг захиалах боломжтой. Бид ажлын өдрүүдэд 09:00-18:00 цагийн хооронд ажилладаг.",
        order: 1,
      },
      {
        question: "Шүдний эмчилгээний үнэ хэд вэ?",
        answer:
          "Шүдний эмчилгээний үнэ нь таны шүдний эрүүл мэндийн байдал болон хийлгэх эмчилгээнээс хамаарна. Шүдний цэвэрлэгээ 50,000₮-с эхэлнэ. Шүдний ломбо 80,000₮-с эхэлнэ. Шүдний суулгац 1,500,000₮-с эхэлнэ. Дэлгэрэнгүй үнийн мэдээллийг 'Үйлчилгээ' хэсгээс харна уу.",
        order: 2,
      },
    ];

    // users ogogdol
    const users = [
      {
        name: "Client User",
        email: "client@example.com",
        password: "password", // system-d user password-iig hash hiij hadgalna
        role: "client",
        phone: "99887766",
        address: "Баянзүрх дүүрэг, 13-р хороолол",
        birthdate: new Date("1990-01-01"),
        gender: "Эрэгтэй",
        allergies: "Байхгүй",
        bloodType: "A+",
      },
      {
        name: "Doctor User",
        email: "doctor@example.com",
        password: "password",
        role: "doctor",
        phone: "99112233",
        address: "Сүхбаатар дүүрэг, 1-р хороо",
        birthdate: new Date("1985-05-15"),
        gender: "Эмэгтэй",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password",
        role: "admin",
        phone: "99445566",
        address: "Хан-Уул дүүрэг, 2-р хороо",
        birthdate: new Date("1982-08-20"),
        gender: "Эрэгтэй",
      },
    ];

    // db tsverleh
    console.log("Clearing existing data...");
    await Doctor.deleteMany({});
    await Service.deleteMany({});
    await FAQ.deleteMany({});
    await User.deleteMany({});

    // shine ogogdol oruulah
    console.log("Inserting new data...");
    await Doctor.insertMany(doctors);
    await Service.insertMany(services);
    await FAQ.insertMany(faqItems);
    await User.insertMany(users);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
