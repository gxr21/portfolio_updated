import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  ar: {
    nav: { home: 'الرئيسية', services: 'خدماتي', projects: 'مشاريعي', certificates: 'شهاداتي', courses: 'الكورسات', experience: 'التجربة', contact: 'اتصل بي', switchLanguage: 'English' },
    common: { learnMore: 'تعرّف على المزيد', backHome: 'العودة إلى الصفحة الرئيسية', loading: 'جارِ التحميل' },
    landing: {
      name: 'علي جلال', role: 'مطور ويب ومصمم واجهات المستخدم',
      intro: 'أهلًا وسهلًا! أنا علي جلال، مطور ويب ومصمم واجهات المستخدم. أعمل على إنشاء تجارب مستخدم مذهلة وتطبيقات ويب فعّالة.',
      downloadCv: 'تنزيل السيرة الذاتية', skillsLabel: 'مهاراتي', skillsTitle: 'التقنيات التي أعمل بها',
      servicesTitle: 'الخدمات التي أقدمها', projectsTitle: 'مشاريعي', certificatesTitle: 'شهاداتي',
      contactTitle: 'هل ترغب في العمل معي؟', contactText: 'إذا كنت تبحث عن مطور ويب موهوب ومصمم واجهات المستخدم، فأنا هنا لمساعدتك. لا تتردد في التواصل معي لمناقشة مشروعك القادم.',
      serviceCards: [
        { title: 'تطوير الويب', description: 'إنشاء مواقع وتطبيقات ويب تفاعلية باستخدام أحدث التقنيات.' },
        { title: 'تطوير تطبيقات الهاتف', description: 'تصميم وتطوير تطبيقات الهاتف الذكية لنظامي iOS وAndroid.' },
        { title: 'أدوات مساعدة', description: 'تطوير أدوات مساعدة لتحسين تجربة المستخدم وزيادة الإنتاجية.' },
      ],
      featuredProjects: [
        { title: 'نظام إدارة الملفات السحابي', description: 'نظام إدارة ملفات سحابي مشفّر يتيح للمستخدمين تخزين الملفات والوصول إليها من أي مكان، مع ميزات مشاركة آمنة وإدارة متقدمة للملفات.' },
        { title: 'نظام إدارة المجمعات الطبية', description: 'نظام متكامل لإدارة المواعيد الطبية، يساعد على تحسين تجربة المرضى وزيادة كفاءة العمليات.' },
        { title: 'موقع حزمة الأمان', description: 'موقع تفاعلي يقدم نصائح وأدوات لحماية البيانات الشخصية وزيادة الوعي بالأمن الرقمي.' },
      ],
    },
    services: {
      eyebrow: 'خدماتي', title: 'الخدمات التي أقدمها', intro: 'حلول رقمية عملية تساعدك على تحويل فكرتك إلى تجربة سهلة وفعّالة.',
      items: [
        { title: 'تطوير الويب', description: 'أحوّل الأفكار إلى مواقع وتطبيقات ويب تفاعلية عالية الأداء، مع تجربة مستخدم سلسة وبنية نظيفة.' },
        { title: 'تطوير تطبيقات الهاتف', description: 'أصمم وأطوّر تطبيقات هاتف حديثة لنظامي iOS وAndroid بواجهات سهلة الاستخدام.' },
        { title: 'أدوات مساعدة', description: 'أبني أدوات وحلولًا مخصصة لأتمتة العمليات وتحسين الإنتاجية وتبسيط المهام.' },
      ],
    },
    projects: {
      title: 'معرض المشاريع', home: 'الصفحة الرئيسية', viewProject: 'عرض GitHub', openProject: 'فتح المشروع', rating: 'تقييم المشروع', ratingAverage: 'متوسط التقييم', ratingCount: 'تقييم',
      items: [
        { id:1, title: 'نظام إدارة الملفات', description: 'واجهة تحكم متكاملة لإدارة وتتبع الملفات، توفر نظرة عامة على الحالة والتاريخ والحجم وأدوات الإجراءات.' },
        { id:2, title: 'منصة الأمان الرقمي', description: 'لوحة تحكم أمنية تهدف إلى حماية البيانات وتقديم أدوات تحليلية وخطط أمنية استباقية.' },
        { id:3, title: 'نظام إدارة المجمعات الطبية', description: 'تطبيق يسهّل الوصول إلى الأطباء والمتخصصين مع بحث دقيق للحصول على الرعاية المناسبة.' },
        { id:4, title: 'منصة الإرشاد الأكاديمي', description: 'بوابة تعليمية تساعد الطلاب على اتخاذ قراراتهم الدراسية بثقة.' },
        { id:5, title: 'لوحة التحكم', description: 'لوحة شاملة لإدارة البيانات ومراقبة الأداء واتخاذ قرارات مبنية على المعلومات.' },
        { id:6, title: 'قبل و بعد', description: 'مشروع متكامل لعرض ابرز الاماكن و المعالم التاريخية بمختلف دول العالم مع امكانية رفع صور و معالجتها بأستخدام الذكاء الاصطناعي.'},
        { id:7, title: 'سراب' , description: 'شات بوت مدعم بالذكاء الاصطناعي يتيح للمستخدمين التفاعل مع النظام والحصول على إجابات فورية وموثوقة على استفساراتهم.'},
        { id:8, title: 'ثروة' , description: 'برنامج سطح مكتب للمساعدة في ادخار المال و حساب تكاليف المعيشة و الادخار و الاستثمار و ادارة الميزانية الشهرية و السنوية و متابعة المصاريف و الدخل و الادخار و الاستثمار و الادارة المالية الشخصية.'},
        { id:9, title: ' واجهة تسجيل دخول (وصالي)' , description: 'واجهة تسجيل دخول متكاملة لموقع وصالي، مع تصميم جذاب وميزات أمان متقدمة لضمان تجربة مستخدم سلسة وآمنة.'},
        { id:10, title: 'واجهة تحكم الطالب (عملية بولونيا)' , description: 'واجهة تحكم للطالب في نظام التعليم البولوني، بالتعاون مع الجامعة التقنية الجنوبية، لإدارة ملفه الشخصي ومتابعة الدورات الدراسية.'},
        { id:11, title: 'موقع تعليم Php' , description:'موقع لتعليم لغة php بأسلوب جميل و منسق و سهل الفهم و يحتوي على امثلة عملية و مشاريع لتطبيق ما تم تعلمه.'},
        { id:12, title: 'آلة حاسبة' , description:'آلة حاسبة بسيطة وسهلة الاستخدام تتيح للمستخدمين إجراء العمليات الحسابية الأساسية بسرعة وكفاءة.'},
        { id:13, title:'واجهة غياب الطلاب' , description:'واجهة لعرض غياب الطلاب و متابعة حضورهم و غيابهم و ارسال تنبيهات للطلاب و اولياء امورهم و متابعة اداء الطلاب و تقديم تقارير مفصلة عن الحضور و الغياب و الاداء.'}
        
      ],
    },
    courses: {
      title: 'الكورسات', empty: 'لا توجد كورسات حالية', open: 'فتح الكورس', back: 'العودة إلى الكورسات', loading: 'جارِ تحميل المحتوى التعليمي',
      upload: 'رفع المقاطع', uploading: 'جارِ الرفع...', uploadKey: 'رمز الرفع', uploadKeyPlaceholder: 'أدخل رمز الرفع',
      uploadSuccess: 'تم رفع المقطع بنجاح.', uploadFailed: 'تعذر رفع المقطع. حاول مرة أخرى.',
      uploadUnauthorized: 'رمز الرفع غير صحيح.', uploadUnavailable: 'الرفع غير مفعّل حالياً. أضف COURSE_UPLOAD_KEY في إعدادات الاستضافة.',
      invalidVideo: 'يُقبل فقط مقطع فيديو بصيغة MP4 أو WebM أو MOV.', fileTooLarge: 'حجم المقطع أكبر من الحد المسموح (100 ميغابايت).',
      items: [
        { id: 'cpp', title: 'كورس C++ للمبتدئين', description: 'أساسيات لغة C++ من الصفر: المتغيرات، الشروط، الحلقات، وأول البرامج.' },
        { id: 'javascript', title: 'كورس جافاسكربت للمبتدئين', description: 'مدخل عملي إلى جافاسكربت لفهم الصفحة التفاعلية وكتابة أول السكربتات.' },
        { id: 'python', title: 'كورس بايثون للمبتدئين', description: 'خطوات أولى في بايثون بأسلوب بسيط، من الأساسيات حتى كتابة برامج صغيرة.' },
      ],
    },
    experience: {
      title: 'التجربة', intro: 'مواقع يمكن فتحها وتجربتها.', browse: 'فتح الموقع', openSite: 'فتح الموقع',
      loading: 'جارِ تجهيز معاينة المواقع', loadingSteps: ['جلب الصفحة', 'تحليل العناصر', 'تجهيز المعاينة'],
      items: [
        { id: 'academic-horizon', title: 'AcademicHorizon', description: 'منصة الأفق الأكاديمي، موقع تعليمي يمكن تصفحه وتجربته من هنا.', url: 'https://academic-horizon-frontend.onrender.com' },
      ],
    },
    form: {
      name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', message: 'الرسالة', namePlaceholder: 'اسمك الكريم', messagePlaceholder: 'اكتب رسالتك هنا...',
      submit: 'إرسال الرسالة', sending: 'جارِ الإرسال...', success: 'تم إرسال رسالتك بنجاح!', failed: 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.',
      required: 'هذا الحقل مطلوب', invalidEmail: 'بريد إلكتروني غير صالح', invalidPhone: 'رقم هاتف غير صالح', shortName: 'الاسم يجب أن يكون حرفين على الأقل', shortMessage: 'الرسالة يجب أن تكون 10 أحرف على الأقل',
    },
    footer: { rights: 'جميع الحقوق محفوظة', visitors: 'زائر', follow: ' تابعني على |' },
    loading: { welcome: 'أهلًا بك', welcomeText: 'يسعدني وجودك هنا، لحظة ونبدأ.', transition: 'جارِ الانتقال إلى', transitionText: 'نجهّز لك الصفحة الآن...' },
    maintenance: { label: 'وضع الصيانة', title: 'الموقع قيد الصيانة', text: 'نعمل حاليًا على تحسين الموقع وإضافة لمسات جديدة. سنعود إليك قريبًا.', thanks: 'شكرًا لصبرك وتفهمك' },
  },
  en: {
    nav: { home: 'Home', services: 'Services', projects: 'Projects', certificates: 'Certificates', courses: 'Courses', experience: 'Experience', contact: 'Contact', switchLanguage: 'العربية' },
    common: { learnMore: 'Learn more', backHome: 'Back to home', loading: 'Loading' },
    landing: {
      name: 'Ali Jalal', role: 'Web Developer & UI Designer',
      intro: 'Welcome! I am Ali Jalal, a web developer and UI designer. I create polished user experiences and effective web applications.',
      downloadCv: 'Download CV', skillsLabel: 'My Skills', skillsTitle: 'Technologies I Work With',
      servicesTitle: 'Services I Offer', projectsTitle: 'My Projects', certificatesTitle: 'My Certificates',
      contactTitle: 'Would you like to work with me?', contactText: 'If you are looking for a skilled web developer and UI designer, I am here to help. Feel free to get in touch to discuss your next project.',
      serviceCards: [
        { title: 'Web Development', description: 'Building interactive websites and web applications with modern technologies.' },
        { title: 'Mobile App Development', description: 'Designing and developing mobile applications for iOS and Android.' },
        { title: 'Helpful Tools', description: 'Creating helpful tools that improve user experience and productivity.' },
      ],
      featuredProjects: [
        { title: 'Cloud File Management System', description: 'An encrypted cloud file management system for storing and accessing files anywhere, with secure sharing and advanced management.' },
        { title: 'Medical Complex Management System', description: 'An integrated appointment management system that improves patient experience and operational efficiency.' },
        { title: 'Security Package Website', description: 'An interactive website offering practical guidance and tools for protecting personal data and improving cyber-security awareness.' },
      ],
    },
    services: {
      eyebrow: 'My Services', title: 'Services I Offer', intro: 'Practical digital solutions that turn your idea into a simple, effective experience.',
      items: [
        { title: 'Web Development', description: 'I turn ideas into high-performance, interactive websites and web applications with clean foundations and smooth user experiences.' },
        { title: 'Mobile App Development', description: 'I design and develop modern mobile applications for iOS and Android with easy-to-use interfaces.' },
        { title: 'Helpful Tools', description: 'I build custom tools and solutions to automate workflows, improve productivity, and simplify complex tasks.' },
      ],
    },
    projects: {
      title: 'Project Gallery', home: 'Home', viewProject: 'View on GitHub', openProject: 'Open project', rating: 'Project rating', ratingAverage: 'average', ratingCount: 'ratings',
      items: [
        { id: 1, title: 'File Management System', description: 'A complete dashboard for managing and tracking files, including their status, history, size, and actions.' },
        { id: 2, title: 'Digital Security Platform', description: 'A security dashboard that protects data with analytical tools and proactive security planning.' },
        { id: 3, title: 'Medical Complex Management System', description: 'An application that makes it easier to find doctors and specialists with precise search tools.' },
        { id: 4, title: 'Academic Guidance Platform', description: 'An educational portal that helps students make their academic decisions with confidence.' },
        { id: 5, title: 'Dashboard', description: 'A comprehensive dashboard for managing data, monitoring performance, and making informed decisions.' },
        { id: 6, title: 'Then and Now', description: 'A project An integrated project to showcase the most prominent historical places and landmarks in various countries around the world, with the ability to upload and process images using artificial intelligence.' },
        { id: 7, title: 'Sarab', description: 'An AI-powered chatbot that allows users to interact with the system and get immediate and reliable answers to their queries.' },
        { id: 8, title: 'Thrwa', description: 'A desktop program to help with saving money, calculating living expenses, saving and investing, managing monthly and annual budgets, tracking expenses and income, and personal financial management.' },
        { id: 9, title: 'Wasaly Login Page Security', description:'A fully integrated login interface for Wasali, with an attractive design and advanced security features to ensure a smooth and secure user experience.' },
        { id: 10, title: 'Dashboard Student Bolonya Proccess' , description: 'A student control interface for the Bologna Education System, in collaboration with the Southern Technical University, to manage their profile and courses.'},
        { id: 11, title: 'Php Learning Website' , description:'A website for learning PHP in a beautiful, organized, and easy-to-understand style, containing practical examples and projects to apply what has been learned.'},
        { id: 12, title: 'Calculator' , description:'A simple and easy-to-use calculator that allows users to perform basic arithmetic operations quickly and efficiently.'},
        { id: 13, title: 'Absence' , description:'An interface to display student absences, track their attendance and absence, send alerts to students and their parents, monitor student performance, and provide detailed reports on attendance, absence, and performance.'}
      ],
    },
    courses: {
      title: 'Courses', empty: 'No courses currently', open: 'Open course', back: 'Back to courses', loading: 'Loading learning content',
      upload: 'Upload lessons', uploading: 'Uploading...', uploadKey: 'Upload key', uploadKeyPlaceholder: 'Enter the upload key',
      uploadSuccess: 'The lesson was uploaded.', uploadFailed: 'The lesson could not be uploaded. Please try again.',
      uploadUnauthorized: 'The upload key is incorrect.', uploadUnavailable: 'Uploads are not enabled yet. Add COURSE_UPLOAD_KEY in the hosting settings.',
      invalidVideo: 'Only an MP4, WebM, or MOV video is accepted.', fileTooLarge: 'The video is larger than the 100 MB limit.',
      items: [
        { id: 'cpp', title: 'C++ for Beginners', description: 'C++ from the ground up: variables, conditions, loops, and your first programs.' },
        { id: 'javascript', title: 'JavaScript for Beginners', description: 'A practical introduction to JavaScript for interactive pages and your first scripts.' },
        { id: 'python', title: 'Python for Beginners', description: 'First steps in Python, from the basics through writing small programs.' },
      ],
    },
    experience: {
      title: 'Experience', intro: 'Websites you can open and try.', browse: 'Open website', openSite: 'Open website',
      loading: 'Preparing website previews', loadingSteps: ['Fetching the page', 'Analyzing elements', 'Preparing the preview'],
      items: [
        { id: 'academic-horizon', title: 'AcademicHorizon', description: 'Academic Horizon, an educational website you can browse and try from here.', url: 'https://academic-horizon-frontend.onrender.com' },
      ],
    },
    form: {
      name: 'Name', email: 'Email address', phone: 'Phone', message: 'Message', namePlaceholder: 'Your name', messagePlaceholder: 'Write your message here...',
      submit: 'Send message', sending: 'Sending...', success: 'Your message was sent successfully!', failed: 'Something went wrong. Please try again.',
      required: 'This field is required', invalidEmail: 'Please enter a valid email address', invalidPhone: 'Please enter a valid phone number', shortName: 'Name must contain at least two characters', shortMessage: 'Message must contain at least 10 characters',
    },
    footer: { rights: 'All rights reserved', visitors: 'visitors', follow: 'Follow me on | ' },
    loading: { welcome: 'Welcome', welcomeText: 'Glad you are here. We will get started in a moment.', transition: 'Taking you to', transitionText: 'Preparing your page now...' },
    maintenance: { label: 'Maintenance mode', title: 'The website is under maintenance', text: 'We are currently improving the website and adding new touches. We will be back soon.', thanks: 'Thank you for your patience and understanding' },
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-language') || 'ar')
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = direction
    document.title = language === 'ar' ? 'علي جلال | مطور ويب' : 'Ali Jalal | Web Developer'
  }, [direction, language])

  const value = useMemo(() => ({ language, direction, t: translations[language], toggleLanguage: () => setLanguage((current) => current === 'ar' ? 'en' : 'ar') }), [direction, language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
