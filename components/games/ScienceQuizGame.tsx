import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ScienceQuizGameProps {
  questionCount: number;
  topics: string[];
  onComplete: (score: number) => void;
  ageGroup: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

const questionsByAge: Record<string, Question[]> = {
  '5-7': [
    {
      question: 'Güneş bize ne verir?',
      options: ['İşık ve ısı', 'Yağmur', 'Kar', 'Rüzgar'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Bitkiler büyümek için neye ihtiyaç duyar?',
      options: ['Su ve güneş', 'Sadece toprak', 'Sadece hava', 'Sadece kar'],
      correctAnswer: 0,
      topic: 'biology',
    },
    {
      question: 'Hangi hayvan süt verir?',
      options: ['Kedi', 'İnek', 'Kuş', 'Balık'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Gökyüzü hangi renktir?',
      options: ['Kırmızı', 'Yeşil', 'Mavi', 'Sarı'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Suyun üç hali vardır. Bunlardan biri nedir?',
      options: ['Buz', 'Taş', 'Odun', 'Toprak'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'İnsanlar nefes almak için neye ihtiyaç duyar?',
      options: ['Su', 'Hava', 'Toprak', 'Ateş'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi hayvan yumurtadan çıkar?',
      options: ['Köpek', 'Kedi', 'Kuş', 'At'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Gece gökyüzünde ne görürüz?',
      options: ['Güneş', 'Ay ve yıldızlar', 'Bulutlar', 'Kuşlar'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Hangi mevsimde kar yağar?',
      options: ['Yaz', 'Sonbahar', 'İlkbahar', 'Kış'],
      correctAnswer: 3,
      topic: 'physics',
    },
    {
      question: 'Balıklar nerede yaşar?',
      options: ['Ağaçta', 'Suda', 'Toprakta', 'Havada'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Elma hangi bitkinin meyvesidir?',
      options: ['Çiçek', 'Ağaç', 'Ot', 'Kaktüs'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi organ görmeyi sağlar?',
      options: ['Kulak', 'Burun', 'Göz', 'Ağız'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Yağmur nereden yağar?',
      options: ['Bulutlardan', 'Denizden', 'Ağaçtan', 'Dağdan'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Hangi hayvan uzun kulakları ile bilinir?',
      options: ['Kedi', 'Tavşan', 'Köpek', 'Fare'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangisi bir sebzedir?',
      options: ['Elma', 'Muz', 'Havuç', 'Üzüm'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Hangi organ kokuları alır?',
      options: ['Göz', 'Kulak', 'Burun', 'Dil'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Arılar ne yapar?',
      options: ['Yumurta', 'Süt', 'Bal', 'Peynir'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Hangi mevsimde çiçekler açar?',
      options: ['Kış', 'İlkbahar', 'Yaz', 'Sonbahar'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Kaç tane göz vardır?',
      options: ['Bir', 'İki', 'Üç', 'Dört'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangisi bir meyve değildir?',
      options: ['Elma', 'Portakal', 'Domates', 'Patates'],
      correctAnswer: 3,
      topic: 'biology',
    },
    {
      question: 'Gece hangi renktir?',
      options: ['Beyaz', 'Karanlık', 'Sarı', 'Kırmızı'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Hangi hayvan havlar?',
      options: ['Kedi', 'Köpek', 'Kuş', 'Balık'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Bitkilerin yeşil kısmına ne denir?',
      options: ['Kök', 'Gövde', 'Yaprak', 'Çiçek'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Su donunca ne olur?',
      options: ['Buhar', 'Buz', 'Sıvı', 'Hiçbiri'],
      correctAnswer: 1,
      topic: 'chemistry',
    },
    {
      question: 'Hangi organ kalp atışlarını sağlar?',
      options: ['Beyin', 'Kalp', 'Mide', 'Akciğer'],
      correctAnswer: 1,
      topic: 'biology',
    },
  ],
  '8-10': [
    {
      question: 'Suyun kimyasal formülü nedir?',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Dünya kendi ekseni etrafında kaç saatte döner?',
      options: ['12 saat', '24 saat', '48 saat', '365 gün'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Fotosentez hangi organelde gerçekleşir?',
      options: ['Mitokondri', 'Kloroplast', 'Ribozom', 'Çekirdek'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Güneş sisteminde kaç gezegen vardır?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Kalbin ana görevi nedir?',
      options: ['Oksijen üretmek', 'Kan pompalamak', 'Sindirim', 'Solunum'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Tuz (sofra tuzu) hangi elementlerden oluşur?',
      options: ['Sodyum ve Klor', 'Karbon ve Oksijen', 'Hidrojen ve Oksijen', 'Kalsiyum ve Karbon'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Hangi gezegen en büyüktür?',
      options: ['Mars', 'Dünya', 'Jüpiter', 'Satürn'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Kaç tane duyumuz vardır?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Hangi organ sindirime yardımcı olur?',
      options: ['Akciğer', 'Mide', 'Kalp', 'Beyin'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Ses nasıl yayılır?',
      options: ['Işık ile', 'Titreşimle', 'Statik olarak', 'Manyetizma ile'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Hangi element havada en çoktur?',
      options: ['Oksijen', 'Hidrojen', 'Azot', 'Karbon dioksit'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Hangi hayvan sürüngendir?',
      options: ['Kurbağa', 'Yılan', 'Balık', 'Kuş'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Bir yılda kaç mevsim vardır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Hangi bitki et yiyen bitkidir?',
      options: ['Gül', 'Papatya', 'Sinek kapan', 'Lale'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Hangi gezegen kırmızı gezegendir?',
      options: ['Venüs', 'Mars', 'Jüpiter', 'Satürn'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Kemiiklerin sert olmasını sağlayan element hangisidir?',
      options: ['Demir', 'Kalsiyum', 'Fosfor', 'Sodyum'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi gaz bitkiler tarafından üretilir?',
      options: ['Azot', 'Karbondioksit', 'Oksijen', 'Hidrojen'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Yeryüzünün yüzde kaçı su ile kaplıdır?',
      options: ['50%', '60%', '70%', '80%'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Hangi organ düşünmeyi sağlar?',
      options: ['Kalp', 'Akciğer', 'Beyin', 'Mide'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Elektriği hangi bilim insanı keşfetti?',
      options: ['Newton', 'Einstein', 'Franklin', 'Edison'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Hangisi bir amfibidir?',
      options: ['Balık', 'Kurbağa', 'Yılan', 'Kuş'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi madde paslanmaya neden olur?',
      options: ['Altın', 'Gümüş', 'Demir', 'Bakır'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Ay neden parlar?',
      options: ['Kendi ışığı var', 'Güneş ışığını yansıtır', 'Elektrik üretir', 'Yanıyor'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Hangi organ kanı temizler?',
      options: ['Kalp', 'Böbrek', 'Akciğer', 'Karaciğer'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi madde mıknatısa yapışır?',
      options: ['Plastik', 'Ahşap', 'Demir', 'Cam'],
      correctAnswer: 2,
      topic: 'physics',
    },
  ],
  '11-13': [
    {
      question: 'Güneş sisteminde kaç gezegen vardır?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Suyun kimyasal formülü nedir?',
      options: ['H2O', 'CO2', 'O2', 'H2O2'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'İnsan vücudunda kaç kemik vardır?',
      options: ['196', '206', '216', '226'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Işık hızı ne kadardır?',
      options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Fotosentez hangi organelde gerçekleşir?',
      options: ['Mitokondri', 'Kloroplast', 'Ribozom', 'Golgi'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Periyodik tabloda hangi element ilk sıradadır?',
      options: ['Helyum', 'Hidrojen', 'Oksijen', 'Azot'],
      correctAnswer: 1,
      topic: 'chemistry',
    },
    {
      question: 'DNA hangi asit türüdür?',
      options: ['Amino asit', 'Nükleik asit', 'Yağ asidi', 'Sitrik asit'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi gezegen halkalara sahiptir?',
      options: ['Mars', 'Venüs', 'Satürn', 'Neptün'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Atomun en küçük parçası nedir?',
      options: ['Proton', 'Nötron', 'Elektron', 'Kuark'],
      correctAnswer: 3,
      topic: 'physics',
    },
    {
      question: 'Hangi vitamin güneşten alınır?',
      options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Elektron negatif mi pozitif mi yüklüdür?',
      options: ['Negatif', 'Pozitif', 'Nötr', 'Her ikisi'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Hangi gaz sera etkisine neden olur?',
      options: ['Oksijen', 'Hidrojen', 'Karbondioksit', 'Azot'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Hücre zarı hangi moleküllerden oluşur?',
      options: ['Protein', 'Lipid', 'Her ikisi', 'Karbonhidrat'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Ses boşlukta yayılır mı?',
      options: ['Evet', 'Hayır', 'Bazen', 'Yavaş yayılır'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'pH 7 nedir?',
      options: ['Asit', 'Baz', 'Nötr', 'Tuz'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Mitokondri neyin enerji santralidir?',
      options: ['Atom', 'Hücre', 'Organ', 'Doku'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Newton hangi yasayı bulmuştur?',
      options: ['Elektrik', 'Manyetik', 'Hareket', 'Kimyasal'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Hangi element altındır?',
      options: ['Au', 'Ag', 'Fe', 'Cu'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Kaç çeşit kan grubu vardır?',
      options: ['2', '4', '6', '8'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Hangi dalga elektromanyetiktir?',
      options: ['Ses', 'Su', 'Işık', 'Deprem'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Hangi element suyun içindedir?',
      options: ['Karbon', 'Hidrojen', 'Azot', 'Kükürt'],
      correctAnswer: 1,
      topic: 'chemistry',
    },
    {
      question: 'Kalp kaç odacıklıdır?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Yer çekimi kuvveti nedir?',
      options: ['9.8 m/s²', '10 m/s²', '8.8 m/s²', '11 m/s²'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Hangi asit mide suyunda bulunur?',
      options: ['Sülfürik', 'Hidroklorik', 'Nitrik', 'Asetik'],
      correctAnswer: 1,
      topic: 'chemistry',
    },
    {
      question: 'Omurgasızlar hangi grupta yer alır?',
      options: ['Memeli', 'Böcek', 'Kuş', 'Balık'],
      correctAnswer: 1,
      topic: 'biology',
    },
  ],
  '14+': [
    {
      question: 'Işık hızı ne kadardır?',
      options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'İnsan DNA\'sı kaç kromozomdan oluşur?',
      options: ['23', '46', '48', '24'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Asit ve bazın karışımına ne denir?',
      options: ['Nötralizasyon', 'Oksitlenme', 'İndirgeme', 'Çözünme'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Yer çekimi ivmesi ne kadardır?',
      options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Hangi organımız insülin hormonu üretir?',
      options: ['Karaciğer', 'Böbrek', 'Pankreas', 'Mide'],
      correctAnswer: 2,
      topic: 'biology',
    },
    {
      question: 'Elmasın kimyasal bileşeni nedir?',
      options: ['Karbon', 'Silikon', 'Grafit', 'Oksijen'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Newton\'un ikinci hareket yasası nedir?',
      options: ['F = ma', 'E = mc²', 'a² + b² = c²', 'V = IR'],
      correctAnswer: 0,
      topic: 'physics',
    },
    {
      question: 'Hücrelerin enerji santrali hangisidir?',
      options: ['Kloroplast', 'Mitokondri', 'Ribozom', 'Golgi'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Asitliği ölçen birim nedir?',
      options: ['pH', 'ppm', 'mol', 'gram'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Kuantum fiziğinin kurucusu kimdir?',
      options: ['Einstein', 'Planck', 'Bohr', 'Heisenberg'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'DNA\'nın yapısını kim keşfetti?',
      options: ['Darwin', 'Watson ve Crick', 'Mendel', 'Pasteur'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'Avogadro sayısı kaçtır?',
      options: ['6.02 x 10²³', '3.14 x 10²²', '9.8 x 10²⁴', '1.6 x 10²⁵'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Schrödinger denklemi hangi alanla ilgilidir?',
      options: ['Klasik mekanik', 'Kuantum mekaniği', 'Termodinamik', 'Elektromanyetizma'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'RNA\'nın görevlerinden biri nedir?',
      options: ['Protein sentezi', 'Enerji üretimi', 'Hücre bölünmesi', 'Sinyal iletimi'],
      correctAnswer: 0,
      topic: 'biology',
    },
    {
      question: 'Elektroliz hangi enerjiyi kullanır?',
      options: ['Isı', 'Elektrik', 'Işık', 'Ses'],
      correctAnswer: 1,
      topic: 'chemistry',
    },
    {
      question: 'Doppler etkisi neyle ilgilidir?',
      options: ['Işık', 'Ses', 'Her ikisi', 'Hiçbiri'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Evrim teorisini kim ortaya attı?',
      options: ['Darwin', 'Lamarck', 'Wallace', 'Mendel'],
      correctAnswer: 0,
      topic: 'biology',
    },
    {
      question: 'Hangi element radyoaktiftir?',
      options: ['Karbon-12', 'Oksijen-16', 'Uranyum-235', 'Demir-56'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Entropi neyi ölçer?',
      options: ['Düzen', 'Düzensizlik', 'Enerji', 'Sıcaklık'],
      correctAnswer: 1,
      topic: 'physics',
    },
    {
      question: 'Kök hücrelerin özelliği nedir?',
      options: ['Farklılaşabilir', 'Ölümsüz', 'Bölünemez', 'Küçük'],
      correctAnswer: 0,
      topic: 'biology',
    },
    {
      question: 'Kataliz nedir?',
      options: ['Reaksiyon hızlandırma', 'Reaksiyon yavaşlatma', 'Reaksiyon durdurma', 'Reaksiyon başlatma'],
      correctAnswer: 0,
      topic: 'chemistry',
    },
    {
      question: 'Kara delik nedir?',
      options: ['Yıldız', 'Gezegen', 'Çökmüş yıldız', 'Nebula'],
      correctAnswer: 2,
      topic: 'physics',
    },
    {
      question: 'Gen ifadesi ne demektir?',
      options: ['DNA kopyalama', 'Protein üretimi', 'Hücre bölünmesi', 'Mutasyon'],
      correctAnswer: 1,
      topic: 'biology',
    },
    {
      question: 'İzotoplar neyle farklılaşır?',
      options: ['Proton', 'Elektron', 'Nötron', 'Atom numarası'],
      correctAnswer: 2,
      topic: 'chemistry',
    },
    {
      question: 'Süperiletkenlik hangi sıcaklıkta olur?',
      options: ['Yüksek sıcaklık', 'Oda sıcaklığı', 'Düşük sıcaklık', 'Değişken'],
      correctAnswer: 2,
      topic: 'physics',
    },
  ],
};

export default function ScienceQuizGame({ questionCount, onComplete, ageGroup }: ScienceQuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const questions = questionsByAge[ageGroup] || questionsByAge['8-10'];
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    setSelectedQuestions(shuffled);
  }, [ageGroup]);

  const handleAnswerSelect = (index: number) => {
    if (feedback !== null) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const question = selectedQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 20);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questionCount) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = isCorrect ? score + 20 : score;
        onComplete(finalScore);
      }
    }, 2000);
  };

  if (selectedQuestions.length === 0) {
    return <View style={styles.container} />;
  }

  const question = selectedQuestions[currentQuestion];
  const topicEmoji = question.topic === 'biology' ? '🧬' : question.topic === 'chemistry' ? '⚗️' : '🔬';

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQuestion + 1) / questionCount) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.questionNumber}>
        Soru {currentQuestion + 1} / {questionCount}
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Skor:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.topicContainer}>
        <Text style={styles.topicEmoji}>{topicEmoji}</Text>
        <Text style={styles.topicText}>
          {question.topic === 'biology' ? 'Biyoloji' : question.topic === 'chemistry' ? 'Kimya' : 'Fizik'}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = feedback !== null && index === question.correctAnswer;
          const isWrong = feedback === 'wrong' && isSelected;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                isCorrect && styles.optionButtonCorrect,
                isWrong && styles.optionButtonWrong,
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={feedback !== null}
            >
              <Text style={[
                styles.optionText,
                (isSelected || isCorrect) && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
              {isCorrect && <Text style={styles.checkMark}>✓</Text>}
              {isWrong && <Text style={styles.crossMark}>✗</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {feedback && (
        <Text style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {feedback === 'correct' ? '✓ Doğru!' : '✗ Yanlış cevap!'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, (selectedAnswer === null || feedback !== null) && styles.buttonDisabled]}
        onPress={checkAnswer}
        disabled={selectedAnswer === null || feedback !== null}
      >
        <Text style={styles.buttonText}>Cevapla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7FAFC',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38B2AC',
    borderRadius: 4,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#38B2AC',
  },
  topicContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#E6FFFA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  topicEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#234E52',
  },
  questionContainer: {
    backgroundColor: '#E6FFFA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#38B2AC',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#2D3748',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#38B2AC',
    backgroundColor: '#E6FFFA',
  },
  optionButtonCorrect: {
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  optionButtonWrong: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  optionTextSelected: {
    color: '#2D3748',
  },
  checkMark: {
    fontSize: 24,
    color: '#48BB78',
    fontWeight: '700',
  },
  crossMark: {
    fontSize: 24,
    color: '#E53E3E',
    fontWeight: '700',
  },
  feedback: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  feedbackCorrect: {
    color: '#48BB78',
  },
  feedbackWrong: {
    color: '#E53E3E',
  },
  button: {
    backgroundColor: '#38B2AC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
