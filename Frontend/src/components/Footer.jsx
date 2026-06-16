const FOOTER_COPY = {
  en: 'Built by Ulsan College students for safe campus trading.',
  ko: '안전한 캠퍼스 거래를 위해 울산과학대학교 학생들이 만들었습니다.',
  ne: 'सुरक्षित क्याम्पस कारोबारका लागि उल्सान कलेजका विद्यार्थीहरूले बनाएको।',
  hi: 'सुरक्षित कैंपस व्यापार के लिए उल्सान कॉलेज के छात्रों द्वारा बनाया गया।',
}

export default function Footer({ language = 'en' }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-copy">
          <span>{FOOTER_COPY[language] || FOOTER_COPY.en}</span>
        </div>
      </div>
    </footer>
  )
}