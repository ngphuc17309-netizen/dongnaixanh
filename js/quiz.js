/* =========================================================
   ĐỒNG NAI XANH - Trắc nghiệm sở thích 4 lựa chọn (goi-y.html)
   Đề xuất địa điểm du lịch (từ 12 điểm đến sẵn có) và
   món ăn / đặc sản (từ 15 đặc sản sẵn có của website).
   ========================================================= */
(function () {
  "use strict";

  const quizApp = document.getElementById("quizApp");
  if (!quizApp) return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const dnx = window.DNX || {
    openModal: () => {},
    showToast: () => {},
    store: { get: (_, fb) => fb, set: () => {} },
  };

  /* ---------- 1. BỘ 6 CÂU HỎI TRẮC NGHIỆM 4 LỰA CHỌN ---------- */
  const QUESTIONS = [
    {
      id: "q1",
      topic: "🏞️ Hoạt động yêu thích",
      question: "Khi lên kế hoạch cho chuyến đi cuối tuần, trải nghiệm nào khiến bạn hào hứng nhất?",
      options: [
        {
          letter: "A",
          icon: "⛺",
          title: "Khám phá thiên nhiên hoang sơ",
          desc: "Hòa mình vào rừng xanh, cắm trại bên mặt hồ, leo núi hoặc tắm thác mát lạnh.",
          scores: { nature: 3, fun: 0, culture: 0, garden: 0 },
          tags: ["cam-trai", "rung-ho", "thac-nui"],
          reasonLabel: "yêu thiên nhiên hoang sơ",
        },
        {
          letter: "B",
          icon: "🌊",
          title: "Vui chơi giải trí sôi động",
          desc: "Thỏa sức trượt nước, tắm biển nhân tạo, chèo kayak và trải nghiệm trò chơi hiện đại.",
          scores: { nature: 0, fun: 3, culture: 0, garden: 0 },
          tags: ["cong-vien-nuoc", "tro-choi", "soi-dong"],
          reasonLabel: "thích vui chơi sôi động",
        },
        {
          letter: "C",
          icon: "🛕",
          title: "Thắng cảnh & chiều sâu văn hóa",
          desc: "Ngắm vách đá soi bóng nước, thăm cổ tự thanh tịnh và tìm hiểu di tích lịch sử.",
          scores: { nature: 0, fun: 0, culture: 3, garden: 0 },
          tags: ["di-tich", "chua-canh", "lich-su"],
          reasonLabel: "mê thắng cảnh – văn hóa",
        },
        {
          letter: "D",
          icon: "🍈",
          title: "Dạo bước miệt vườn bình yên",
          desc: "Thong dong dưới tán cây trĩu quả, hít hà hương bưởi và thưởng thức trái ngọt tại vườn.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 3 },
          tags: ["miet-vuon", "trai-cay", "thu-gian"],
          reasonLabel: "chuộng không gian miệt vườn",
        },
      ],
    },
    {
      id: "q2",
      topic: "🚗 Bạn đồng hành & khoảng cách",
      question: "Bạn dự định đi cùng ai và ưu tiên quãng đường di chuyển từ TP.HCM như thế nào?",
      options: [
        {
          letter: "A",
          icon: "🏍️",
          title: "Hội bạn thân mê phượt (70 – 130 km)",
          desc: "Càng đi xa phố thị càng thú vị, miễn là cảnh rừng thác hùng vĩ và đáng giá.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 0 },
          tags: ["di-xa", "nhom-ban", "phuot"],
          reasonLabel: "hợp nhóm bạn đi phượt",
        },
        {
          letter: "B",
          icon: "👨‍👩‍👧‍👦",
          title: "Gia đình hoặc đoàn đông (15 – 35 km)",
          desc: "Ưu tiên đường gần Sài Gòn, khuôn viên rộng rãi, an toàn và đầy đủ tiện ích.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          tags: ["gan-sg", "gia-dinh", "tien-nghi"],
          reasonLabel: "gần Sài Gòn, tiện nghi cho gia đình",
        },
        {
          letter: "C",
          icon: "📸",
          title: "Cặp đôi / nhóm nhỏ mê check-in",
          desc: "Quãng đường vừa phải (30 – 80 km), có nhiều góc cảnh quan độc đáo để lưu giữ kỷ niệm.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          tags: ["check-in", "vua-phai"],
          reasonLabel: "nhiều góc check-in ấn tượng",
        },
        {
          letter: "D",
          icon: "🌿",
          title: "Đi đổi gió nhẹ nhàng, tiết kiệm",
          desc: "Chuyến đi gọn trong ngày với chi phí hợp lý để nạp lại năng lượng sau tuần làm việc.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          tags: ["tiet-kiem", "doi-gio"],
          reasonLabel: "chi phí hợp lý, dễ đi trong ngày",
        },
      ],
    },
    {
      id: "q3",
      topic: "⚡ Nhịp điệu chuyến đi",
      question: "Nhịp điệu hoạt động nào phản ánh đúng nhất cá tính du lịch của bạn?",
      options: [
        {
          letter: "A",
          icon: "🔥",
          title: "Năng động & thích thử thách",
          desc: "Trekking xuyên rừng, săn bình minh trên đỉnh núi hoặc tổ chức tiệc BBQ dưới bầu trời sao.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 0 },
          tags: ["trekking", "cam-trai", "bbq"],
          reasonLabel: "hợp cắm trại, săn mây & BBQ",
        },
        {
          letter: "B",
          icon: "🎉",
          title: "Rộn ràng & sảng khoái",
          desc: "Trải nghiệm cảm giác mạnh, tắm mát thỏa thích hoặc thử sức với các trò vận động tập thể.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          tags: ["cam-giac-manh", "nuoc", "soi-dong"],
          reasonLabel: "nhiều trò vận động dưới nước",
        },
        {
          letter: "C",
          icon: "🍃",
          title: "Chậm rãi & tĩnh lặng",
          desc: "Đi thuyền ra ốc đảo xanh, đọc sách dưới tán cây hoặc thong thả vãn cảnh chùa cổ.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          tags: ["tinh-lang", "ngam-canh"],
          reasonLabel: "không gian yên tĩnh, thư thái",
        },
        {
          letter: "D",
          icon: "🧺",
          title: "Thư thả & mộc mạc",
          desc: "Ngồi chòi mát câu cá, chèo xuồng ba lá và nhâm nhi ẩm thực miệt vườn dân dã.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          tags: ["moc-mac", "cau-ca", "trai-cay"],
          reasonLabel: "trải nghiệm mộc mạc, gần gũi",
        },
      ],
    },
    {
      id: "q4",
      topic: "🍲 Khẩu vị món chính",
      question: "Đến giờ ăn trưa tại Đồng Nai, hương vị nào hấp dẫn vị giác của bạn nhất?",
      options: [
        {
          letter: "A",
          icon: "🥒",
          title: "Vị núi rừng thanh mát & nướng thơm",
          desc: "Lẩu rau rừng thanh nhiệt hơi đắng nhẹ hoặc các món đặc sản nướng than hoa dậy mùi.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 0 },
          foodTags: ["dan-da", "nuong", "thanh-mat"],
          foodReason: "hợp gu món nướng & vị rừng thanh mát",
        },
        {
          letter: "B",
          icon: "🦐",
          title: "Lẩu ngọt thanh hoặc cơm gà chắc bụng",
          desc: "Nồi lẩu tôm nóng hổi quây quần hoặc dĩa cơm gà cá mặn đậm đà tiếp sức ngày dài.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          foodTags: ["lau-am-cung", "com-no", "gia-dinh"],
          foodReason: "hợp bữa ăn ấm cúng, no nê dễ thưởng thức",
        },
        {
          letter: "C",
          icon: "🥗",
          title: "Món gỏi chua cay, trộn tinh tế",
          desc: "Sự hòa quyện khéo léo giữa vị chua ngọt, rau thơm, đậu phộng rang đậm bản sắc xứ Biên Hòa.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          foodTags: ["goi-chua-cay", "truyen-thong"],
          foodReason: "đúng chuẩn vị gỏi chua ngọt truyền thống",
        },
        {
          letter: "D",
          icon: "🍢",
          title: "Quà vặt nướng xiên & bánh dân gian",
          desc: "Thích thưởng thức nhiều món nhỏ xinh như chả lụi cuốn rau sống, bánh lá dẻo thơm.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          foodTags: ["an-vat", "banh-dan-gian", "binh-dan"],
          foodReason: "hợp sở thích ăn vặt & quà bánh dân dã",
        },
      ],
    },
    {
      id: "q5",
      topic: "🥢 Gu khám phá ẩm thực",
      question: "Khi chọn quán ăn ở vùng đất mới, bạn thường ưu tiên tiêu chí nào?",
      options: [
        {
          letter: "A",
          icon: "🦗",
          title: "Săn tìm đặc sản độc lạ miền quê",
          desc: "Muốn nếm thử những món hiếm gặp ở thành phố như dế cơm chiên giòn, thịt dông cát.",
          scores: { nature: 1, fun: 0, culture: 0, garden: 0 },
          foodTags: ["doc-la", "dan-da"],
          foodReason: "đặc sản đồng quê độc đáo, lạ miệng",
        },
        {
          letter: "B",
          icon: "🍽️",
          title: "Món ngon nổi tiếng, ai ăn cũng khen",
          desc: "Hương vị hài hòa, nguyên liệu tôm thịt tươi ngon phù hợp cho cả trẻ nhỏ lẫn người lớn.",
          scores: { nature: 0, fun: 1, culture: 0, garden: 0 },
          foodTags: ["de-an", "noi-tieng", "gia-dinh"],
          foodReason: "dễ ăn, hợp khẩu vị cả nhóm & gia đình",
        },
        {
          letter: "C",
          icon: "🏆",
          title: "Quán trứ danh lâu đời của địa phương",
          desc: "Tìm đến đúng những tên tuổi gắn liền với thương hiệu ẩm thực Biên Hòa – Long Khánh.",
          scores: { nature: 0, fun: 0, culture: 1, garden: 0 },
          foodTags: ["lau-doi", "tru-danh"],
          foodReason: "món trứ danh lâu đời của Đồng Nai",
        },
        {
          letter: "D",
          icon: "🍐",
          title: "Món thanh đạm chế biến từ trái vườn",
          desc: "Ưu tiên hương vị tươi mát từ nông sản địa phương, nhẹ bụng và tốt cho sức khỏe.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 1 },
          foodTags: ["thanh-dam", "trai-cay-mon"],
          foodReason: "vị thanh mát từ trái cây địa phương",
        },
      ],
    },
    {
      id: "q6",
      topic: "🎁 Quà mang về",
      question: "Kết thúc hành trình, bạn muốn mua thức quà đặc sản nào về biếu người thân?",
      options: [
        {
          letter: "A",
          icon: "🍄",
          title: "Lộc quý từ rừng & sông Đồng Nai",
          desc: "Nấm mối tự nhiên ngọt lành, trái ươi rừng thanh nhiệt hoặc cá kìm sông phơi khô.",
          scores: { nature: 1, fun: 0, culture: 0, garden: 0 },
          giftTags: ["qua-rung-song"],
          foodReason: "quà thiên nhiên quý của rừng & sông Đồng Nai",
        },
        {
          letter: "B",
          icon: "🍒",
          title: "Trái cây Long Khánh chín mọng",
          desc: "Những chùm chôm chôm đỏ tươi tróc vỏ hoặc mít tố nữ vàng ươm thơm lừng.",
          scores: { nature: 0, fun: 1, culture: 0, garden: 0 },
          giftTags: ["qua-long-khanh"],
          foodReason: "trái cây vườn đất đỏ bazan ngọt thanh",
        },
        {
          letter: "C",
          icon: "🐠",
          title: "Đặc sản khô & quà truyền thống",
          desc: "Cá kìm khô đậm vị sông Đồng Nai hoặc những chiếc bánh gai Hố Nai gói lá chuối thơm.",
          scores: { nature: 0, fun: 0, culture: 1, garden: 0 },
          giftTags: ["qua-truyen-thong"],
          foodReason: "thức quà truyền thống bảo quản tiện lợi",
        },
        {
          letter: "D",
          icon: "🍐",
          title: "Bưởi Tân Triều trứ danh",
          desc: "Những trái bưởi vỏ mỏng, múi hồng ngọt thanh – món quà biếu sang trọng và ý nghĩa.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 1 },
          giftTags: ["qua-tan-trieu"],
          foodReason: "đặc sản làm quà biếu nổi tiếng bậc nhất",
        },
      ],
    },
    {
      id: "q7",
      topic: "🏺 Trải nghiệm làng nghề",
      question: "Nếu ghé thăm một làng nghề truyền thống tại Đồng Nai, chất liệu thủ công nào cuốn hút bạn nhất?",
      options: [
        {
          letter: "A",
          icon: "🧶",
          title: "Thổ cẩm người Mạ & mây tre tự nhiên",
          desc: "Tận mắt xem đồng bào dệt hoa văn ở Tà Lài hoặc bàn tay đan lát mây tre, nón lá buông.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 1 },
          artTags: ["tho-cam", "dan-lat", "ban-dia"],
          artReason: "yêu nét mộc mạc từ sợi dệt & mây tre tự nhiên",
        },
        {
          letter: "B",
          icon: "🔨",
          title: "Xưởng mộc nội thất & gò tôn phố nghề",
          desc: "Khám phá nhịp lao động rộn ràng của các cơ sở mộc và nghề gò tôn lâu năm vùng Hố Nai.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          artTags: ["moc-ho-nai", "go-ton", "pho-nghe"],
          artReason: "thích nhịp lao động khéo léo vùng Hố Nai",
        },
        {
          letter: "C",
          icon: "🏺",
          title: "Gốm cổ Tân Vạn & điêu khắc đá Bửu Long",
          desc: "Chiêm ngưỡng lò gốm từ năm 1875 và nghệ thuật chạm khắc đá xanh granit 300 năm tuổi.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          artTags: ["gom-tan-van", "da-buu-long", "tram-nam"],
          artReason: "trân trọng di sản mỹ nghệ trăm năm tuổi",
        },
        {
          letter: "D",
          icon: "🎋",
          title: "Lò nấu đường mía thủ công thơm ngọt",
          desc: "Cảm nhận hương mật mía ngào ngạt bên bếp lửa hồng và câu hát ru xứ Vĩnh Cửu.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          artTags: ["mia-duong", "dan-lat", "que-huong"],
          artReason: "chuộng hương vị làng nghề đồng quê dân dã",
        },
      ],
    },
    {
      id: "q8",
      topic: "🎨 Tác phẩm thủ công mỹ nghệ",
      question: "Trong các sản phẩm kết tinh từ bàn tay nghệ nhân Biên Hòa – Đồng Nai, bạn ấn tượng với món nào nhất?",
      options: [
        {
          letter: "A",
          icon: "🧣",
          title: "Tấm thổ cẩm mang sắc màu đại ngàn",
          desc: "Hoa văn tinh tế phản ánh thế giới quan gắn bó với núi rừng của cộng đồng người Mạ.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 0 },
          artTags: ["tho-cam", "ban-dia"],
          artReason: "mê hoa văn thổ cẩm giàu bản sắc núi rừng",
        },
        {
          letter: "B",
          icon: "🧺",
          title: "Giỏ mây tre xuất khẩu & đồ gia dụng tinh xảo",
          desc: "Khay, hộp, giỏ xách tre đan thanh lịch hoặc các vật dụng gò tôn bền bỉ qua năm tháng.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          artTags: ["dan-lat", "go-ton"],
          artReason: "ưa thích sản phẩm thủ công ứng dụng khéo léo",
        },
        {
          letter: "C",
          icon: "🗿",
          title: "Gốm mỹ nghệ Biên Hòa & kiến trúc gỗ, đá cổ",
          desc: "Tác phẩm gốm nổi danh thế giới, tượng đá xanh Bửu Long và chạm khắc gỗ đình chùa.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          artTags: ["gom-tan-van", "da-buu-long", "moc-ho-nai"],
          artReason: "yêu đường nét điêu khắc & tạo hình mỹ thuật cổ",
        },
        {
          letter: "D",
          icon: "🍯",
          title: "Táng đường đinh vàng óng & nếp nhà gỗ ấm",
          desc: "Những sản vật mộc mạc gắn với gian bếp quê hương và kiến trúc nhà ở dân gian.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          artTags: ["mia-duong", "moc-ho-nai"],
          artReason: "gần gũi với nếp sống truyền thống ấm cúng",
        },
      ],
    },
    {
      id: "q9",
      topic: "🎶 Giai điệu & dòng nhạc",
      question: "Khi lắng nghe âm nhạc gắn liền với vùng đất Đồng Nai, giai điệu nào chạm đến cảm xúc của bạn nhất?",
      options: [
        {
          letter: "A",
          icon: "🥁",
          title: "Âm vang cồng chiêng & dân ca buôn làng",
          desc: "Tiếng đàn tre chinh k’la, khèn bầu hòa cùng điệu hát lễ Sayangva, Sayangbri của người Chơro, Mạ.",
          scores: { nature: 2, fun: 0, culture: 0, garden: 0 },
          artTags: ["dan-ca", "ban-dia"],
          musicReason: "rung động trước âm nhạc núi rừng & cồng chiêng bản địa",
        },
        {
          letter: "B",
          icon: "🎤",
          title: "Nhạc trẻ sôi động & giọng ca đương đại",
          desc: "Thưởng thức các bản hit từ những ca sĩ nổi tiếng quê gốc Đồng Nai như Quốc Thiên, Khởi My, Song Luân.",
          scores: { nature: 0, fun: 2, culture: 0, garden: 0 },
          artTags: ["ca-si-tre", "hien-dai"],
          musicReason: "yêu thích các giọng ca trẻ trung, giàu năng lượng",
        },
        {
          letter: "C",
          icon: "🪕",
          title: "Đờn ca tài tử & khúc tráng ca lịch sử",
          desc: "Tiếng đờn kìm sâu lắng Nam Bộ cùng giai điệu hào hùng về Chiến khu Đ và dòng sông Đồng Nai.",
          scores: { nature: 0, fun: 0, culture: 2, garden: 0 },
          artTags: ["don-ca", "ca-khuc-que"],
          musicReason: "đồng điệu với đờn ca tài tử & khúc ca truyền thống",
        },
        {
          letter: "D",
          icon: "🎼",
          title: "Tình ca quê hương & bolero sâu lắng",
          desc: "Những bản nhạc trữ tình mộc mạc ngợi ca tình đất, tình người phương Nam và giọng ca ngọt ngào.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 2 },
          artTags: ["nhac-si", "ca-khuc-que", "don-ca"],
          musicReason: "say mê giai điệu trữ tình quê hương mộc mạc",
        },
      ],
    },
    {
      id: "q10",
      topic: "🎭 Hoạt động thưởng thức nghệ thuật",
      question: "Nếu dành thêm thời gian cho trải nghiệm văn hóa – nghệ thuật trong chuyến đi, bạn sẽ chọn gì?",
      options: [
        {
          letter: "A",
          icon: "🔥",
          title: "Giao lưu văn hóa Chơro – Mạ giữa đại ngàn",
          desc: "Tìm hiểu các bài dân ca cổ Oh sing goh, Pantaorămseh và nghề dệt thổ cẩm ven rừng Tà Lài.",
          scores: { nature: 1, fun: 0, culture: 0, garden: 0 },
          artTags: ["dan-ca", "tho-cam"],
          musicReason: "muốn khám phá chiều sâu văn hóa buôn làng",
        },
        {
          letter: "B",
          icon: "🎧",
          title: "Bật playlist nghệ sĩ Đồng Nai & dạo phố nghề",
          desc: "Vừa vi vu vừa nghe nhạc của các ca sĩ gốc Đồng Nai và ghé thăm khu làng nghề nhộn nhịp.",
          scores: { nature: 0, fun: 1, culture: 0, garden: 0 },
          artTags: ["ca-si-tre", "moc-ho-nai", "dan-lat"],
          musicReason: "thích kết hợp du ngoạn sôi nổi cùng âm nhạc hiện đại",
        },
        {
          letter: "C",
          icon: "🏛️",
          title: "Hành trình di sản ven sông & nghe tài tử",
          desc: "Ghé làng đá Bửu Long, lò gốm Tân Vạn rồi lắng nghe cung bậc đờn ca tài tử bên bờ sông.",
          scores: { nature: 0, fun: 0, culture: 1, garden: 0 },
          artTags: ["don-ca", "da-buu-long", "gom-tan-van"],
          musicReason: "hứng thú với hành trình di sản trăm năm ven sông",
        },
        {
          letter: "D",
          icon: "🌿",
          title: "Nghe tình ca Đồng Nai giữa không gian quê",
          desc: "Thư thả nghe Về Đồng Nai, Lòng quê, Về quê anh và tìm về lò đường mía thủ công Bình Lợi.",
          scores: { nature: 0, fun: 0, culture: 0, garden: 1 },
          artTags: ["ca-khuc-que", "nhac-si", "mia-duong"],
          musicReason: "yêu những sáng tác viết về cảnh sắc bình dị Đồng Nai",
        },
      ],
    },
  ];

  /* ---------- 2. CHÂN DUNG 4 NHÓM SỞ THÍCH CHỦ ĐẠO ---------- */
  const PERSONAS = {
    nature: {
      icon: "🏕️",
      title: "Nhà Thám Hiểm Xanh",
      subtitle: "Đam mê rừng nguyên sinh, hồ nước & trải nghiệm dân dã",
      desc: "Bạn tìm kiếm sự tự do giữa thiên nhiên khoáng đạt – từ cắm trại bên hồ Trị An, băng rừng Mã Đà đến chinh phục núi Chứa Chan và thưởng thức những hương vị đồng quê mộc mạc nhất.",
    },
    fun: {
      icon: "🎢",
      title: "Tín Đồ Vui Chơi Sôi Động",
      subtitle: "Yêu năng lượng rực rỡ, tiện nghi & những bữa ăn sum vầy",
      desc: "Chuyến đi lý tưởng của bạn tràn ngập tiếng cười cùng gia đình hoặc hội bạn tại các khu giải trí dưới nước hiện đại gần Sài Gòn, khép lại bằng nồi lẩu nóng hổi và giỏ trái cây ngọt lịm.",
    },
    culture: {
      icon: "🛕",
      title: "Người Yêu Văn Hóa & Bình Yên",
      subtitle: "Trân trọng thắng cảnh kỳ vĩ, chiều sâu lịch sử & vị truyền thống",
      desc: "Bạn yêu nhịp sống chậm rãi để chiêm ngưỡng vẻ đẹp sơn thủy hữu tình, những di tích trăm năm của vùng đất Biên Hòa – Định Quán và thưởng thức các món trứ danh lâu đời.",
    },
    garden: {
      icon: "🍈",
      title: "Tâm Hồn Miệt Vườn & Sành Ăn",
      subtitle: "Chuộng không gian xanh thanh bình & tinh hoa nông sản địa phương",
      desc: "Bạn thích những chuyến đổi gió nhẹ nhàng dưới bóng mát vườn bưởi Tân Triều hay vườn trái cây Long Khánh, thong thả nếm trọn từ món gỏi thanh tao đến quà vặt dân gian.",
    },
  };

  /* ---------- 3. DỮ LIỆU 12 ĐIỂM ĐẾN SẴN CÓ TRÊN WEB ---------- */
  const DESTINATIONS = [
    {
      id: "amazing-bay",
      title: "Công viên nước The Amazing Bay – Vịnh Kỳ Diệu",
      formName: "The Amazing Bay",
      badge: "Vui chơi",
      image: "images/amazing-bay.jpg",
      g1: "#0369a1",
      g2: "#22d3ee",
      meta: ["📍 22 Võ Thị Sáu, P. Long Tân, Biên Hòa", "🚗 Cách TP.HCM khoảng 30 km"],
      desc: "Tổ hợp vui chơi giải trí dưới nước quy mô lớn, được mệnh danh là “vịnh biển giữa lòng thành phố”, sở hữu diện tích hơn 25 ha với hàng loạt công trình hiện đại và hệ thống trò chơi đẳng cấp quốc tế.",
      moreHtml: `<p>Nơi đây nổi bật với những kỷ lục ấn tượng như: <strong>biển nhân tạo lớn nhất Việt Nam</strong>, <strong>dòng sông lười dài nhất Đông Nam Á</strong> và hệ thống máng trượt nước cao hơn 20 mét.</p>
        <p>Khuôn viên chia thành nhiều phân khu phù hợp mọi độ tuổi: khu trẻ em, khu cảm giác mạnh, bãi biển nhân tạo và chuỗi nhà hàng tiện ích.</p>
        <h4>🎟️ Giá vé tham khảo</h4>
        <ul class="list"><li>Người lớn: khoảng 450.000 VNĐ</li><li>Trẻ em: khoảng 350.000 VNĐ</li></ul>`,
      price: "Từ 350.000đ",
      region: "bien-hoa",
      weights: { fun: 4, nature: 0, culture: 0, garden: 0 },
      tags: ["cong-vien-nuoc", "tro-choi", "soi-dong", "gan-sg", "gia-dinh", "tien-nghi", "cam-giac-manh", "nuoc"],
    },
    {
      id: "rung-ma-da",
      title: "Rừng Mã Đà",
      formName: "Rừng Mã Đà",
      badge: "Thiên nhiên",
      image: "images/rung-ma-da.jpg",
      g1: "#14532d",
      g2: "#4ade80",
      meta: ["📍 Khu bảo tồn thiên nhiên – văn hóa Đồng Nai, Vĩnh Cửu", "🚗 Cách TP.HCM khoảng 90 km"],
      desc: "Khu rừng nguyên sinh xanh mát và bí ẩn với hệ sinh thái phong phú – nơi lý tưởng cho du lịch sinh thái, trekking, cắm trại và khám phá thiên nhiên hoang dã.",
      moreHtml: `<p>Khu rừng nổi bật với thảm thực vật rậm rạp, những con đường mòn uốn lượn, suối nước trong lành và gắn liền với nhiều <strong>dấu tích lịch sử kháng chiến</strong> hào hùng.</p>
        <h4>🎟️ Giá vé tham khảo</h4>
        <ul class="list"><li>Tham quan &amp; cắm trại: 50.000 – 100.000 VNĐ/người tùy dịch vụ</li></ul>`,
      price: "50.000 – 100.000đ",
      region: "vinh-cuu",
      weights: { nature: 4, culture: 1.5, fun: 0, garden: 0 },
      tags: ["cam-trai", "rung-ho", "di-xa", "nhom-ban", "phuot", "trekking", "lich-su"],
    },
    {
      id: "ho-tri-an",
      title: "Hồ Trị An – viên ngọc xanh của Đồng Nai",
      formName: "Hồ Trị An",
      badge: "Thiên nhiên",
      image: "images/ho-tri-an.jpg",
      g1: "#065f46",
      g2: "#38bdf8",
      meta: ["📍 Vĩnh Cửu, Định Quán, Thống Nhất", "🚗 Cách TP.HCM khoảng 70 km"],
      desc: "Hồ nước ngọt nhân tạo rộng lớn trên sông Đồng Nai, bao quanh bởi rừng nguyên sinh – điểm cắm trại, chèo SUP/kayak và ngắm hoàng hôn lý tưởng.",
      moreHtml: `<p>Hồ Trị An gây ấn tượng với mặt nước xanh trong, bao quanh là rừng rậm và những hòn đảo nhỏ hoang sơ. Ban đêm du khách có thể tổ chức tiệc BBQ, ngắm sao trong không khí tĩnh lặng.</p>
        <h4>🎟️ Giá dịch vụ tham khảo</h4>
        <ul class="list"><li>Cắm trại &amp; tham quan: 50.000 – 150.000 VNĐ/người tùy gói dịch vụ</li></ul>`,
      price: "50.000 – 150.000đ",
      region: "vinh-cuu",
      weights: { nature: 4, culture: 1, fun: 1, garden: 1 },
      tags: ["cam-trai", "rung-ho", "nhom-ban", "phuot", "vua-phai", "bbq", "tinh-lang", "ngam-canh", "cau-ca"],
    },
    {
      id: "thac-da-han",
      title: "Thác Đá Hàn",
      formName: "Thác Đá Hàn",
      badge: "Thiên nhiên",
      image: "images/thac-da-han.jpg",
      g1: "#0f766e",
      g2: "#a3e635",
      meta: ["📍 Trảng Bom, Đồng Nai", "🚗 Cách trung tâm Sài Gòn khoảng 70 km"],
      desc: "Không gian thoáng đãng, khung cảnh đa dạng, không khí trong lành mát mẻ – địa điểm cắm trại, tắm thác, dã ngoại cuối tuần lý tưởng cho nhóm bạn hoặc gia đình.",
      moreHtml: `<p>Thác Đá Hàn có các hoạt động tắm thác, câu cá, dã ngoại cuối tuần với <strong>đa số hoạt động giải trí miễn phí</strong> và có cả đường đua xe địa hình hấp dẫn.</p>`,
      price: "Hầu hết miễn phí",
      region: "bien-hoa",
      weights: { nature: 2.5, fun: 2.5, garden: 1.5, culture: 0 },
      tags: ["thac-nui", "cam-trai", "nhom-ban", "gia-dinh", "tiet-kiem", "doi-gio", "cam-giac-manh", "nuoc", "cau-ca"],
    },
    {
      id: "thac-mai",
      title: "Thác Mai – ngọn thác hoang sơ bậc nhất Đồng Nai",
      formName: "Thác Mai",
      badge: "Thiên nhiên",
      image: "images/thac-mai.jpg",
      g1: "#166534",
      g2: "#0891b2",
      meta: ["📍 Định Quán, Đồng Nai", "🏍️ Cách Sài Gòn ~130 km (2 – 3 giờ xe máy)"],
      desc: "Khung cảnh rừng nguyên sinh choáng ngợp, bình yên và hoang sơ – địa điểm lý tưởng để cắm trại, nướng đồ ăn picnic cuối tuần.",
      moreHtml: `<p>Ngọn thác biến chuyển kỳ thú giữa những ghềnh đá và rừng già, từng xuất hiện ấn tượng trong MV “Lật Mặt” của Lý Hải.</p>`,
      price: "Cắm trại tự túc",
      region: "dinh-quan",
      weights: { nature: 4, fun: 0, culture: 0.5, garden: 0 },
      tags: ["cam-trai", "thac-nui", "di-xa", "nhom-ban", "phuot", "bbq"],
    },
    {
      id: "buu-long",
      title: "Khu du lịch Bửu Long",
      formName: "Khu du lịch Bửu Long",
      badge: "Văn hóa – Lịch sử",
      image: "images/buu-long.jpg",
      g1: "#4d7c0f",
      g2: "#06b6d4",
      meta: ["📍 TP. Biên Hòa, Đồng Nai", "🏔️ Long Sơn Thạch Động & núi Bình Điện"],
      desc: "Được ví như “Vịnh Hạ Long thu nhỏ” với làn nước trong xanh soi bóng vách đá, Bửu Phong Cổ Tự cổ kính và khu vui chơi cho mọi lứa tuổi.",
      moreHtml: `<p>Địa điểm gồm hai phần chính là <strong>Long Sơn Thạch Động</strong> và <strong>núi Bình Điện</strong>, kết hợp vãn cảnh <strong>Bửu Phong Cổ Tự</strong>, khu Tiền Sử và các trò chơi giải trí hiện đại.</p>`,
      price: "Phù hợp mọi lứa tuổi",
      region: "bien-hoa",
      weights: { culture: 4, fun: 2, garden: 1, nature: 1 },
      tags: ["chua-canh", "di-tich", "gan-sg", "gia-dinh", "check-in", "tinh-lang", "ngam-canh", "tien-nghi"],
    },
    {
      id: "tre-viet",
      title: "Khu du lịch Tre Việt",
      formName: "Khu du lịch Tre Việt",
      badge: "Vui chơi",
      image: "images/tre-viet.jpg",
      g1: "#3f6212",
      g2: "#facc15",
      meta: ["📍 Nhơn Trạch, Đồng Nai – cách Sài Gòn ~15 km", "📐 Diện tích 45.000 m²"],
      desc: "Không gian mộc mạc với kiến trúc tre độc đáo ngay sát Sài Gòn, quy tụ vô vàn trò chơi dưới nước từ truyền thống đến hiện đại.",
      moreHtml: `<p>Thỏa sức bơi lội, đạp xe trên mặt nước, chèo kayak hoặc trải nghiệm chèo thuyền chuối, xuồng ba lá, thuyền thúng vui nhộn.</p>`,
      price: "Gần Sài Gòn nhất",
      region: "nhon-trach",
      weights: { fun: 3.5, garden: 2, nature: 0.5, culture: 1 },
      tags: ["tro-choi", "soi-dong", "gan-sg", "gia-dinh", "tien-nghi", "nuoc", "moc-mac", "doi-gio"],
    },
    {
      id: "nui-chua-chan",
      title: "Núi Chứa Chan",
      formName: "Núi Chứa Chan",
      badge: "Thiên nhiên",
      image: "images/nui-chua-chan.jpg",
      g1: "#9a3412",
      g2: "#fbbf24",
      meta: ["📍 Xuân Lộc, Đồng Nai", "🥾 Leo núi – săn bình minh, hoàng hôn"],
      desc: "Đệ nhị thiên sơn Nam Bộ – điểm hẹn yêu thích của giới trẻ đam mê leo núi, check-in cây đa ba gốc và săn cỏ lau vàng tháng 5.",
      moreHtml: `<p>Đỉnh núi mang đến khung cảnh bình minh và hoàng hôn tuyệt đẹp cùng dòng suối mát ngọt lành trên cung đường chinh phục.</p>`,
      price: "Đẹp nhất tháng 5",
      region: "long-khanh",
      weights: { nature: 3.5, culture: 1.5, fun: 0.5, garden: 0 },
      tags: ["thac-nui", "di-xa", "nhom-ban", "phuot", "check-in", "trekking"],
    },
    {
      id: "da-ba-chong",
      title: "Đá Ba Chồng",
      formName: "Đá Ba Chồng",
      badge: "Văn hóa – Lịch sử",
      image: "images/da-ba-chong.jpg",
      g1: "#57534e",
      g2: "#84cc16",
      meta: ["📍 Trung tâm Định Quán, Đồng Nai", "🏛️ Di tích thắng cảnh cấp quốc gia (1988)"],
      desc: "Quần thể đá xếp chồng kỳ thú hình thành từ biến đổi địa chất, gắn liền với dấu tích văn hóa Óc Eo – Phù Nam cổ xưa.",
      moreHtml: `<p>Nằm ngay cung đường khám phá Định Quán – Tân Phú, quần thể Đá Ba Chồng được công nhận là di tích thắng cảnh cấp quốc gia từ năm 1988.</p>`,
      price: "Di tích quốc gia",
      region: "dinh-quan",
      weights: { culture: 4, nature: 1, fun: 0, garden: 0.5 },
      tags: ["di-tich", "lich-su", "check-in", "vua-phai", "ngam-canh", "tiet-kiem"],
    },
    {
      id: "lang-buoi-tan-trieu",
      title: "Làng Bưởi Tân Triều",
      formName: "Làng Bưởi Tân Triều",
      badge: "Miệt vườn",
      image: "images/lang-buoi-tan-trieu.jpg",
      g1: "#65a30d",
      g2: "#fde047",
      meta: ["📍 Cách TP. Biên Hòa chỉ 3 km", "🍽️ Ẩm thực đặc sắc từ bưởi"],
      desc: "Làng bưởi cù lao xanh mát thoang thoảng hương hoa bưởi trong gió, nổi danh với những món ngon chế biến từ bưởi “tiến Vua”.",
      moreHtml: `<p>Tại đây bạn được thưởng thức trọn bộ đặc sản từ bưởi: <strong>gỏi bưởi, nem bưởi, gà hấp bưởi, chè bưởi</strong> và mua rượu bưởi Tân Triều về làm quà.</p>`,
      price: "Gần Biên Hòa",
      region: "tan-trieu",
      weights: { garden: 4, culture: 1.5, fun: 0.5, nature: 0.5 },
      tags: ["miet-vuon", "trai-cay", "thu-gian", "gan-sg", "gia-dinh", "tiet-kiem", "doi-gio", "moc-mac"],
    },
    {
      id: "vuon-trai-cay-long-khanh",
      title: "Vườn trái cây Long Khánh",
      formName: "Vườn trái cây Long Khánh",
      badge: "Miệt vườn",
      image: "images/vuon-trai-cay-long-khanh.jpg",
      g1: "#b91c1c",
      g2: "#f59e0b",
      meta: ["📍 Long Khánh, Đồng Nai", "📅 Đẹp nhất từ tháng 7 đến tháng 8"],
      desc: "Thủ phủ trái cây miền Đông bạt ngàn chôm chôm, sầu riêng, măng cụt, mít tố nữ chín rộ chờ bạn tự tay hái và thưởng thức tại vườn.",
      moreHtml: `<p>Chỉ khoảng <strong>50.000 VNĐ</strong> vé vào vườn, bạn thỏa thích ăn trái cây chín cây, dạo mát, câu cá và nạp đầy năng lượng xanh.</p>`,
      price: "Vé 50.000đ",
      region: "long-khanh",
      weights: { garden: 4, fun: 1.5, nature: 1, culture: 0 },
      tags: ["miet-vuon", "trai-cay", "thu-gian", "tiet-kiem", "doi-gio", "moc-mac", "cau-ca", "vua-phai"],
    },
    {
      id: "dao-o",
      title: "Đảo Ó",
      formName: "Đảo Ó",
      badge: "Thiên nhiên",
      image: "images/cu-lao-pho.jpg",
      g1: "#0e7490",
      g2: "#34d399",
      meta: ["📍 Giữa lòng hồ Trị An, xã Mã Đà, Vĩnh Cửu", "🚤 ~30 phút đi thuyền từ bến xã Vĩnh An"],
      desc: "“Ốc đảo xanh” tách biệt giữa mặt hồ Trị An mênh mông – chốn bình yên để cắm trại, đạp xe quanh đảo, chèo kayak và đọc sách.",
      moreHtml: `<p>Không khí trong lành, tiếng chim hót rộn ràng cùng mặt hồ phẳng lặng rất hợp cho người muốn rời xa phố thị ồn ào.</p>
        <h4>🎟️ Giá vé tham khảo</h4>
        <ul class="list"><li>150.000 – 300.000 VNĐ/người (gồm vé tàu khứ hồi và phí vào đảo)</li></ul>`,
      price: "150.000 – 300.000đ",
      region: "vinh-cuu",
      weights: { nature: 3, culture: 2.5, garden: 2, fun: 0.5 },
      tags: ["rung-ho", "cam-trai", "check-in", "vua-phai", "tinh-lang", "ngam-canh", "thu-gian", "cau-ca"],
    },
  ];

  /* ---------- 4. DỮ LIỆU 15 MÓN ĂN & ĐẶC SẢN SẴN CÓ TRÊN WEB ---------- */
  const FOODS = [
    {
      id: "goi-ca",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🐟",
      g1: "#0f766e",
      g2: "#84cc16",
      title: "Gỏi cá Biên Hòa",
      desc: "Đặc sản nổi tiếng nhất vùng đất này, chế biến từ cá trắm đen tươi thái lát mỏng, trộn dừa nạo, hành tím, ớt, lạc rang và nước mắm pha chua ngọt đậm đà.",
      moreHtml: `<p>Món gỏi có vị chua cay đặc trưng, thịt cá ngọt tươi kết hợp hoàn hảo với thính và rau sống.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Gỏi Cá Tân Mai Kim Yến (Huỳnh Văn Hớn, Biên Hòa)</li><li>Gỏi Cá Tân Mai (đường Võ Thị Sáu)</li></ul>`,
      price: "80.000 – 150.000đ/dĩa",
      regions: ["bien-hoa", "tan-trieu"],
      weights: { culture: 3.5, fun: 1.5, garden: 1, nature: 1 },
      tags: ["goi-chua-cay", "truyen-thong", "lau-doi", "tru-danh"],
    },
    {
      id: "lau-tom",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🦐",
      g1: "#c2410c",
      g2: "#fb923c",
      title: "Lẩu tôm Biên Hòa",
      desc: "Nước dùng nấu từ xương heo, tôm khô và cá khô cho vị ngọt thanh tự nhiên; tôm tươi to béo ăn kèm rau muống, bông so đũa, bắp chuối non và bánh tráng nướng.",
      moreHtml: `<p>Món lẩu mang hương vị đậm đà, cực kỳ phù hợp cho bữa ăn gia đình hoặc nhóm bạn quây quần.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Lẩu Tôm 5 Ri (Biên Hòa)</li><li>Quán Lẩu Tôm Bà Sáu (đường Phan Chu Trinh)</li></ul>`,
      price: "200.000 – 350.000đ/nồi",
      regions: ["bien-hoa", "nhon-trach", "tan-trieu"],
      weights: { fun: 3.5, culture: 2, garden: 1.5, nature: 0.5 },
      tags: ["lau-am-cung", "gia-dinh", "de-an", "noi-tieng", "lau-doi", "tru-danh"],
    },
    {
      id: "com-ga-ca-man",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🍗",
      g1: "#a16207",
      g2: "#fde047",
      title: "Cơm gà cá mặn Long Khánh",
      desc: "Món ăn độc đáo kết hợp thịt gà luộc hoặc nướng thơm phức với cá mặn (cá trắm) kho, nướng hoặc nấu canh chua trong cùng một bữa cơm.",
      moreHtml: `<p>Sự kết hợp tạo nên hương vị cân bằng giữa vị ngọt của thịt gà và vị đậm đà đưa cơm của cá mặn.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Các quán ăn ở chợ địa phương Long Khánh</li><li>Nhà hàng Đặc Sản Long Khánh (đường Hùng Vương)</li></ul>`,
      price: "120.000 – 200.000đ/suất",
      regions: ["long-khanh", "dinh-quan"],
      weights: { fun: 2.5, culture: 2, garden: 2, nature: 1.5 },
      tags: ["com-no", "gia-dinh", "de-an", "noi-tieng", "tru-danh"],
    },
    {
      id: "lau-kho-qua",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🥒",
      g1: "#166534",
      g2: "#86efac",
      title: "Lẩu khổ qua rừng",
      desc: "Khổ qua rừng vị đắng nhẹ đặc trưng, nấu cùng nước dùng xương heo và tôm khô – thanh nhiệt, giải độc, ăn kèm thịt heo, tôm tươi và rau rừng.",
      moreHtml: `<p>Món lẩu thanh mát, bổ dưỡng, càng ăn càng cảm nhận vị ngọt hậu đặc trưng của khổ qua rừng Đồng Nai.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Lẩu khổ qua Dầu Giây (Thống Nhất, Đồng Nai)</li><li>Lẩu Khổ Qua Bảo Toàn (Thống Nhất, Đồng Nai)</li></ul>`,
      price: "180.000 – 300.000đ/nồi",
      regions: ["vinh-cuu", "long-khanh", "dinh-quan"],
      weights: { nature: 3.5, garden: 2, fun: 1, culture: 1 },
      tags: ["dan-da", "thanh-mat", "lau-am-cung", "thanh-dam"],
    },
    {
      id: "cha-lui",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🍢",
      g1: "#9a3412",
      g2: "#f97316",
      title: "Chả lụi Biên Hòa",
      desc: "Thịt heo xay nhuyễn trộn gia vị, nướng trên than hoa đến khi vàng đồng; ăn kèm bánh tráng nướng, rau sống và nước chấm chua ngọt.",
      moreHtml: `<p>Món ăn vặt xế chiều thơm lừng khói bếp, giá hạt dẻ được giới trẻ và các gia đình vô cùng yêu thích.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Chợ đêm Biên Hòa</li><li>Chả Lụi Năm Căn (đường Võ Văn Kiệt)</li><li>Chả Lụi LaGi &amp; Nem Nướng Mẹt Phố (Biên Hòa)</li></ul>`,
      price: "15.000 – 25.000đ/xiên",
      regions: ["bien-hoa", "tan-trieu", "nhon-trach"],
      weights: { garden: 2.5, fun: 2.5, culture: 1, nature: 0.5 },
      tags: ["an-vat", "binh-dan", "nuong", "de-an", "noi-tieng"],
    },
    {
      id: "goi-buoi",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🥗",
      g1: "#be185d",
      g2: "#fda4af",
      title: "Gỏi bưởi Tân Triều",
      desc: "Bưởi Tân Triều múi to, ngọt thanh, ít hạt trộn cùng tôm khô, thịt heo luộc thái sợi, rau răm, húng lủi và đậu phộng rang.",
      moreHtml: `<p>Nước trộn gỏi pha chua ngọt hài hòa tôn lên tép bưởi giòn mọng không hề bị đắng.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Vườn Bưởi Tân Triều (xã Tân Triều)</li><li>Chợ Tân Phú</li></ul>`,
      price: "60.000 – 100.000đ/dĩa",
      regions: ["tan-trieu", "bien-hoa"],
      weights: { garden: 4, culture: 2, fun: 0.5, nature: 0.5 },
      tags: ["goi-chua-cay", "truyen-thong", "thanh-dam", "trai-cay-mon", "binh-dan"],
    },
    {
      id: "banh-gai",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🍙",
      g1: "#1f2937",
      g2: "#4d7c0f",
      title: "Bánh gai Hố Nai",
      desc: "Đặc sản truyền thống màu xanh đen từ lá gai; vỏ dẻo mềm, nhân đậu xanh hoặc thịt mỡ ngọt béo, gói trong lá chuối thơm đặc biệt.",
      moreHtml: `<p>Thức bánh thủ công gói trọn sự khéo léo của người dân Hố Nai, vừa ăn chơi vừa hợp mua về biếu.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Lò Bánh Gai Truyền Thống Hố Nai (phường Hố Nai)</li><li>Chợ Hố Nai</li></ul>`,
      price: "10.000 – 18.000đ/cái",
      regions: ["bien-hoa"],
      weights: { culture: 2.5, garden: 2.5, fun: 0.5, nature: 0 },
      tags: ["banh-dan-gian", "an-vat", "binh-dan", "truyen-thong", "lau-doi", "thanh-dam"],
    },
    {
      id: "de-com",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🦗",
      g1: "#78350f",
      g2: "#d97706",
      title: "Dế cơm chiên nước mắm",
      desc: "Món ăn độc đáo của vùng nông thôn Đồng Nai: dế cơm làm sạch, tẩm gia vị rồi chiên giòn, béo ngậy và thơm nồng.",
      moreHtml: `<p>Giàu đạm, giòn rụm và dậy mùi nước mắm tỏi ớt – trải nghiệm ẩm thực đồng quê cực kỳ thú vị khi ghé Định Quán.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Chợ Định Quán</li><li>Các quán ăn địa phương vùng Định Quán – Tân Phú</li></ul>`,
      price: "80.000 – 120.000đ/dĩa",
      regions: ["dinh-quan", "vinh-cuu"],
      weights: { nature: 3.5, culture: 1, fun: 0, garden: 0 },
      tags: ["doc-la", "dan-da"],
    },
    {
      id: "thit-dong",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🔥",
      g1: "#854d0e",
      g2: "#facc15",
      title: "Thịt dông cát",
      desc: "Món ăn truyền thống của vùng nông thôn, thịt trắng thơm có vị ngọt tự nhiên, thường được nướng than hoa hoặc nấu cà ri.",
      moreHtml: `<p>Đặc sản giàu dinh dưỡng nổi tiếng tại Vĩnh An (hồ Trị An), Tân Phú và Nhơn Trạch.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Quán Thịt Dông Cát (huyện Nhơn Trạch)</li><li>Hàng Thịt Dông Nướng (chợ Vĩnh An)</li><li>Nhà hàng Đặc Sản Miền Quê (huyện Tân Phú)</li></ul>`,
      price: "150.000 – 250.000đ/kg",
      regions: ["vinh-cuu", "nhon-trach", "dinh-quan"],
      weights: { nature: 3.5, fun: 1, culture: 0.5, garden: 0 },
      tags: ["doc-la", "dan-da", "nuong"],
    },
    {
      id: "trai-uoi",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🌰",
      g1: "#57534e",
      g2: "#a8a29e",
      title: "Trái ươi rừng",
      desc: "Đặc sản quý từ rừng núi Đồng Nai, ngâm nở pha nước đường phèn hạt chia giúp thanh nhiệt, giải độc tuyệt vời sau chuyến đi nắng.",
      moreHtml: `<p>Ươi rừng Đồng Nai trái nhỏ chắc nhưng độ nở và hương vị thơm mát vượt trội, dễ bảo quản mang về.</p>`,
      price: "50.000 – 150.000đ/kg",
      regions: ["vinh-cuu", "dinh-quan"],
      weights: { nature: 3.5, culture: 1, garden: 1, fun: 0 },
      tags: ["qua-rung-song"],
    },
    {
      id: "mit-to-nu",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🍈",
      g1: "#65a30d",
      g2: "#facc15",
      title: "Mít tố nữ Long Khánh",
      desc: "Giống mít đặc sản với múi nhỏ vàng đậm, thịt dày dẻo mềm, vị ngọt thanh và hương thơm nồng nàn quyến rũ.",
      moreHtml: `<p>Thức quà miệt vườn cao cấp rất được lòng du khách khi ghé thăm vùng đất đỏ Long Khánh.</p>`,
      price: "80.000 – 150.000đ/kg",
      regions: ["long-khanh"],
      weights: { garden: 3, fun: 2.5, culture: 1, nature: 0.5 },
      tags: ["qua-long-khanh", "qua-tan-trieu"],
    },
    {
      id: "chom-chom",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🍒",
      g1: "#b91c1c",
      g2: "#fb7185",
      title: "Chôm chôm Long Khánh",
      desc: "Vỏ đỏ tươi, cùi dày trắng trong, tróc hạt, ngọt thanh mát – đặc sản trứ danh trồng trên vùng đất đỏ bazan màu mỡ.",
      moreHtml: `<p>Mua trực tiếp tại vườn hoặc dọc cung đường Long Khánh – Xuân Lộc luôn tươi rói và giá rất phải chăng.</p>`,
      price: "40.000 – 100.000đ/kg",
      regions: ["long-khanh"],
      weights: { fun: 3, garden: 3, nature: 1, culture: 0.5 },
      tags: ["qua-long-khanh"],
    },
    {
      id: "buoi-tan-trieu",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🍐",
      g1: "#4d7c0f",
      g2: "#bef264",
      title: "Bưởi Tân Triều",
      desc: "Múi to hồng nhạt, vỏ mỏng, ít hạt, vị ngọt đậm pha chút thanh dịu từ phù sa cù lao sông Đồng Nai.",
      moreHtml: `<p>Món quà biếu sang đẹp, để được lâu ngày mà càng xuống nước vị bưởi càng ngọt đậm đà.</p>`,
      price: "60.000 – 120.000đ/trái",
      regions: ["tan-trieu", "bien-hoa"],
      weights: { garden: 4, culture: 2, fun: 1.5, nature: 0 },
      tags: ["qua-tan-trieu", "qua-truyen-thong"],
    },
    {
      id: "nam-moi",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🍄",
      g1: "#44403c",
      g2: "#d6d3d1",
      title: "Nấm mối Đồng Nai",
      desc: "Mọc tự nhiên sau những cơn mưa đầu mùa, vị ngọt thanh giòn sần sật và giàu dưỡng chất – đặc sản thiên nhiên được săn đón.",
      moreHtml: `<p>Có thể mua nấm tươi chế biến ngay hoặc nấm mối khô đóng gói tiện lợi mang đi xa.</p>
        <h4>💰 Giá tham khảo</h4>
        <ul class="list"><li>Nấm mối tươi: 200.000 – 400.000đ/kg</li><li>Nấm mối khô: 800.000 – 1.200.000đ/kg</li></ul>`,
      price: "Từ 200.000đ/kg",
      regions: ["dinh-quan", "long-khanh", "vinh-cuu"],
      weights: { nature: 3.5, garden: 1.5, culture: 1, fun: 0 },
      tags: ["qua-rung-song"],
    },
    {
      id: "ca-kim-kho",
      category: "qua",
      badge: "Trái cây & quà",
      emoji: "🐠",
      g1: "#1e3a8a",
      g2: "#60a5fa",
      title: "Cá kìm khô",
      desc: "Cá kìm đánh bắt từ lòng hồ Trị An – sông Đồng Nai, phơi nắng tự nhiên giữ trọn thớ thịt săn chắc, ngọt hậu.",
      moreHtml: `<p>Dùng trộn gỏi xoài, chiên giòn, nướng hay nấu canh chua đều bắt cơm, rất tiện đóng gói mang về làm quà.</p>`,
      price: "150.000 – 600.000đ/kg",
      regions: ["vinh-cuu", "bien-hoa"],
      weights: { culture: 3, nature: 3, fun: 0.5, garden: 0.5 },
      tags: ["qua-truyen-thong", "qua-rung-song"],
    },
    {
      id: "xoi-chien-phong",
      category: "mon-an",
      badge: "Món ăn",
      emoji: "🥟",
      g1: "#b45309",
      g2: "#fde047",
      title: "Xôi chiên phồng Biên Hòa",
      desc: "Đặc sản Đồng Nai đạt Kỷ lục Châu Á: nếp dẻo giã nhuyễn cùng đậu xanh và đường, chiên phồng tròn vàng ươm giòn rụm bên ngoài, dẻo thơm bên trong.",
      moreHtml: `<p>Thường ăn nóng kèm gà quay hoặc gà nướng tại các nhà hàng ven sông Đồng Nai và khu vực Bửu Long.</p>
        <h4>📍 Địa điểm thưởng thức</h4>
        <ul class="list"><li>Nhà hàng Cây Dừa (TP. Biên Hòa)</li><li>Các quán ăn gia đình ven sông Đồng Nai</li></ul>`,
      price: "60.000 – 100.000đ/phần",
      regions: ["bien-hoa", "tan-trieu"],
      weights: { culture: 3, fun: 3, garden: 2, nature: 0.5 },
      tags: ["de-an", "noi-tieng", "lau-doi", "tru-danh", "gia-dinh", "an-vat"],
    },
  ];

  /* ---------- 4b. DỮ LIỆU 12 NÉT ĐẸP NGHỆ THUẬT (7 LÀNG NGHỀ + 5 MỤC CA HÁT) ---------- */
  const ARTS = [
    {
      id: "nghe-moc",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🪵",
      image: "images/nghe-moc.jpg",
      g1: "#5c3317",
      g2: "#b45309",
      title: "Nghề làm đồ mộc Biên Hòa – Hố Nai",
      meta: "📍 Tân Biên & Tân Hòa (Hố Nai), TP. Biên Hòa",
      desc: "Nổi tiếng từ đầu thế kỷ XX với đồ mộc mỹ nghệ trên kiến trúc đình, chùa, nhà cổ và phát triển mạnh thành làng mộc sầm uất tại khu vực Hố Nai.",
      moreHtml: `<p>Đồ mộc Đồng Nai kết hợp hài hòa giữa kỹ thuật chạm khắc truyền thống và sản xuất nội thất hiện đại phục vụ thị trường trong và ngoài tỉnh.</p>`,
      subLabel: "Mộc mỹ nghệ & nội thất",
      regions: ["bien-hoa"],
      weights: { fun: 2.5, culture: 2.5, garden: 2, nature: 0.5 },
      tags: ["moc-ho-nai", "pho-nghe"],
    },
    {
      id: "nghe-go-ton",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🔨",
      image: "images/nghe-go-ton.jpg",
      g1: "#334155",
      g2: "#0ea5e9",
      title: "Nghề gò tôn Hố Nai",
      meta: "📍 KP.2 & KP.3 phường Hố Nai, TP. Biên Hòa",
      desc: "Làng nghề khoảng 60 năm tuổi chế tác thủ công thùng, xô, gáo múc nước, nồi nấu rượu, máng xối bằng đôi tay khéo léo, nhộn nhịp nhất từ tháng 8 đến tháng 11.",
      moreHtml: `<p>Dù hiện nay chỉ còn gần 10 cơ sở duy trì trước sự cạnh tranh của đồ nhựa, tiếng búa gò tôn vẫn là ký ức lao động đặc trưng của vùng đất Hố Nai.</p>`,
      subLabel: "~60 năm lịch sử",
      regions: ["bien-hoa"],
      weights: { fun: 3, culture: 1.5, garden: 1, nature: 0 },
      tags: ["go-ton", "pho-nghe"],
    },
    {
      id: "nghe-mia-duong",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🎋",
      image: "images/nghe-mia-duong.jpg",
      g1: "#166534",
      g2: "#eab308",
      title: "Nghề trồng mía, nấu đường ở Vĩnh Cửu",
      meta: "📍 Xã Bình Lợi, huyện Vĩnh Cửu",
      desc: "Nghề thủ công lâu đời tạo nên bản sắc văn hóa riêng cho vùng đất Vĩnh Cửu với những lò đường đỏ lửa theo mùa vụ và câu ca dao táng đường đinh ngọt ngào.",
      moreHtml: `<p>Niềm tự hào lao động kết tinh trong lời hát ru: <em>“Vái ông tơ một chong bánh tráng, Vái bà nguyệt một táng đường đinh...”</em></p>`,
      subLabel: "Đặc trưng Bình Lợi",
      regions: ["vinh-cuu", "tan-trieu"],
      weights: { garden: 4, nature: 2, culture: 1.5, fun: 0.5 },
      tags: ["mia-duong", "que-huong"],
    },
    {
      id: "nghe-dan-lat",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🧺",
      image: "images/nghe-dan-lat.jpg",
      g1: "#3f6212",
      g2: "#14b8a6",
      title: "Nghề đan lát (mây, tre, lá)",
      meta: "📍 Phước Tân, Phước Lộc, Tam Hòa & Quang Vinh",
      desc: "Từ đan rổ, rá, thúng, nón lá buông 13 – 17 vành phục vụ chợ quê đến các sản phẩm khay, hộp, giỏ xách mây tre đan xuất khẩu ra thế giới.",
      moreHtml: `<p>Các cơ sở tại Tam Hòa và Quang Vinh (Biên Hòa) vẫn duy trì hàng chục nhân công làm hàng mây tre đan xuất khẩu mang lại giá trị kinh tế cao.</p>`,
      subLabel: "Mây tre & nón lá buông",
      regions: ["bien-hoa", "nhon-trach"],
      weights: { fun: 2.5, garden: 2.5, nature: 2, culture: 1 },
      tags: ["dan-lat", "que-huong"],
    },
    {
      id: "nghe-tho-cam",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🧶",
      image: "images/nghe-tho-cam.jpg",
      g1: "#7f1d1d",
      g2: "#d97706",
      title: "Nghề dệt thổ cẩm ở Tà Lài",
      meta: "📍 Cộng đồng người Mạ – xã Tà Lài, Tân Phú",
      desc: "Những tấm chăn, váy, khố, dây quấn đầu rực rỡ hoa văn gửi gắm thế giới quan phong phú của người Mạ, đang hồi sinh mạnh mẽ qua các dự án truyền dạy.",
      moreHtml: `<p>Mỗi hoa văn trên thổ cẩm Tà Lài là một câu chuyện về thiên nhiên đại ngàn, gắn liền với bản sắc văn hóa lâu đời của cư dân bản địa.</p>`,
      subLabel: "Di sản người Mạ",
      regions: ["dinh-quan", "vinh-cuu", "long-khanh"],
      weights: { nature: 4, culture: 2, garden: 1, fun: 0.5 },
      tags: ["tho-cam", "ban-dia"],
    },
    {
      id: "nghe-da-buu-long",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🗿",
      image: "images/nghe-da-buu-long.jpg",
      g1: "#1e293b",
      g2: "#0d9488",
      title: "Nghề đá Bửu Long",
      meta: "📍 Phường Bửu Long, TP. Biên Hòa",
      desc: "Làng nghề điêu khắc đá 300 năm tuổi nổi danh trong và ngoài nước với các nghệ nhân lão luyện chế tác trên chất liệu đá xanh granit đặc trưng.",
      moreHtml: `<p>Nằm ngay khu vực danh thắng Bửu Long, rất thuận tiện để bạn vừa du ngoạn vừa chiêm ngưỡng tinh hoa điêu khắc đá cổ truyền.</p>`,
      subLabel: "300 năm điêu khắc",
      regions: ["bien-hoa", "tan-trieu"],
      weights: { culture: 4, nature: 1, fun: 1, garden: 1 },
      tags: ["da-buu-long", "tram-nam"],
    },
    {
      id: "nghe-gom-tan-van",
      category: "lang-nghe",
      anchor: "lang-nghe",
      badge: "Làng nghề",
      emoji: "🏺",
      image: "images/nghe-gom-tan-van.jpg",
      g1: "#7c2d12",
      g2: "#ea580c",
      title: "Nghề gốm Tân Vạn – Biên Hòa",
      meta: "📍 Tân Vạn, TP. Biên Hòa · Từ năm 1875",
      desc: "Khởi nguồn từ lò gốm lu đất sét đỏ kỹ thuật dải cuộn (1875), thăng hoa rực rỡ cùng dòng gốm mỹ nghệ kể từ khi trường Bá nghệ Biên Hòa ra đời và vươn tầm xuất khẩu.",
      moreHtml: `<p>Gốm Biên Hòa nổi tiếng bởi xương đất chắc khỏe và men màu độc đáo, là niềm tự hào của thủ công mỹ nghệ Nam Bộ suốt hơn một thế kỷ.</p>`,
      subLabel: "Từ 1875 · Xuất khẩu quốc tế",
      regions: ["bien-hoa", "nhon-trach"],
      weights: { culture: 4, garden: 1.5, fun: 1.5, nature: 0.5 },
      tags: ["gom-tan-van", "tram-nam"],
    },
    {
      id: "don-ca-tai-tu",
      category: "ca-hat",
      anchor: "ca-hat",
      badge: "Ca hát",
      emoji: "🪕",
      image: "images/don-ca-tai-tu.jpg",
      g1: "#0f5132",
      g2: "#0284c7",
      title: "Đờn ca tài tử tại Đồng Nai",
      meta: "🎶 Nghệ nhân Phạm Văn Lơ, Lê Văn Lợi, Đặng Văn Vĩnh",
      desc: "Loại hình diễn xướng dân gian Nam Bộ thấm đẫm tình đất, tình người ven sông Đồng Nai, được giữ lửa bởi nhiều nghệ nhân dân gian tâm huyết.",
      moreHtml: `<p>Thưởng thức tiếng đờn kìm, nhịp song lang giữa không gian cù lao sông nước hay vườn bưởi Tân Triều là trải nghiệm văn hóa khó quên.</p>`,
      subLabel: "Di sản Nam Bộ",
      regions: ["bien-hoa", "tan-trieu", "nhon-trach"],
      weights: { culture: 4, garden: 2.5, nature: 1, fun: 0.5 },
      tags: ["don-ca"],
    },
    {
      id: "dan-ca-dan-toc",
      category: "ca-hat",
      anchor: "ca-hat",
      badge: "Ca hát",
      emoji: "🥁",
      image: "images/dan-ca-dan-toc.jpg",
      g1: "#78350f",
      g2: "#dc2626",
      title: "Dân ca & Diễn xướng buôn làng bản địa",
      meta: "🎶 Chơro, Mạ, S’tiêng, Kơ Ho · Nghệ nhân Nguyễn Văn Nổi, Ka Bào",
      desc: "Âm nhạc núi rừng hòa quyện cồng chiêng đồng, đàn tre chinh k’la, khèn bầu trong lễ Sayangva, Sayangbri cùng các bài dân ca Oh sing goh, Pantaorămseh.",
      moreHtml: `<p>Kho tàng quý giá này được lưu giữ qua tiếng hát của các nghệ nhân gạo cội và công trình sưu tầm <em>51 bài dân ca Mạ – Chơro – S’tiêng ở Đồng Nai</em> của nhạc sĩ Trần Viết Bính.</p>`,
      subLabel: "Âm vang đại ngàn",
      regions: ["vinh-cuu", "dinh-quan", "long-khanh"],
      weights: { nature: 4, culture: 2.5, garden: 1, fun: 0.5 },
      tags: ["dan-ca", "ban-dia"],
    },
    {
      id: "ca-khuc-dong-nai",
      category: "ca-hat",
      anchor: "ca-hat",
      badge: "Ca hát",
      emoji: "🎵",
      image: "images/nhac-si-dong-nai.jpg",
      g1: "#14532d",
      g2: "#0d9488",
      title: "Tuyển tập ca khúc viết về Đồng Nai",
      meta: "🎶 Về Đồng Nai, Cồng vang đêm Chiến khu Đ, Lòng quê...",
      desc: "7 ca khúc tiêu biểu khắc họa vẻ đẹp dòng sông Đồng Nai, hào khí Chiến khu Đ và tình yêu quê hương của các nhạc sĩ Xuân Hồng, Nguyễn Khánh Hòa, Điểu Được, Lệ Hằng, Cao Hồng Sơn...",
      moreHtml: `<p>Từ bản tình ca bất hủ <em>Về Đồng Nai</em> (Xuân Hồng) đến <em>Điện sáng về làng Chơro</em> (Điểu Được) và <em>Về quê anh</em> (Lệ Hằng), mỗi giai điệu đều ngân vang niềm tự hào xứ sở.</p>`,
      subLabel: "7 bản tình ca quê hương",
      regions: ["vinh-cuu", "bien-hoa", "tan-trieu"],
      weights: { garden: 3.5, culture: 3, nature: 1.5, fun: 1 },
      tags: ["ca-khuc-que"],
    },
    {
      id: "nhac-si-dong-nai",
      category: "ca-hat",
      anchor: "ca-hat",
      badge: "Ca hát",
      emoji: "🎼",
      image: "images/nhac-si-dong-nai.jpg",
      g1: "#1e3a8a",
      g2: "#0f766e",
      title: "Các nhạc sĩ tiêu biểu gắn với Đồng Nai",
      meta: "🎶 Trần Viết Bính, Cao Hồng Sơn, Điểu Được, Nguyễn Khánh Hòa, Lệ Hằng",
      desc: "Lực lượng sáng tác giàu tâm huyết của Hội Văn học Nghệ thuật Đồng Nai với nhiều tác phẩm đạt giải thưởng uy tín và lan tỏa khắp cả nước.",
      moreHtml: `<p>Tiêu biểu có cố nhạc sĩ Trần Viết Bính (<em>Hạt gạo làng ta</em>, <em>Gạc Ma – vọng mãi tên anh</em>), nhạc sĩ Cao Hồng Sơn, nhạc sĩ Điểu Được, nhạc sĩ Nguyễn Khánh Hòa, nhạc sĩ Lệ Hằng.</p>`,
      subLabel: "Lực lượng sáng tác",
      regions: ["bien-hoa", "long-khanh"],
      weights: { garden: 3, culture: 3, nature: 1, fun: 1 },
      tags: ["nhac-si"],
    },
    {
      id: "ca-si-dong-nai",
      category: "ca-hat",
      anchor: "ca-hat",
      badge: "Ca hát",
      emoji: "🎤",
      image: "images/ca-si-dong-nai.jpg",
      g1: "#581c87",
      g2: "#be185d",
      title: "Các giọng ca nổi tiếng quê gốc Đồng Nai",
      meta: "🎶 Mạnh Quỳnh, Quốc Thiên, Khởi My, Song Luân, Nguyễn Ngọc Quế",
      desc: "Những giọng ca tài năng sinh ra từ Biên Hòa, Long Khánh, Thống Nhất ghi dấu ấn đậm nét ở cả nhạc trẻ sôi động lẫn bolero trữ tình.",
      moreHtml: `<p>Playlist hoàn hảo cho chuyến đi của bạn với giọng hát nội lực của Quốc Thiên, sự tươi trẻ của Khởi My, Song Luân hay chất trữ tình ngọt ngào của Mạnh Quỳnh.</p>`,
      subLabel: "Ngôi sao âm nhạc",
      regions: ["bien-hoa", "long-khanh"],
      weights: { fun: 4, garden: 1.5, culture: 1, nature: 0.5 },
      tags: ["ca-si-tre", "hien-dai"],
    },
  ];

  /* ---------- 5. TRẠNG THÁI & PHẦN TỬ DOM ---------- */
  const totalQ = QUESTIONS.length;
  let currentStep = 0;
  // Mảng lưu chỉ số đáp án (0..3) cho 6 câu hỏi, hoặc null nếu chưa chọn
  let answers = dnx.store.get("dn-quiz-answers", Array(totalQ).fill(null));
  if (!Array.isArray(answers) || answers.length !== totalQ) {
    answers = Array(totalQ).fill(null);
  }
  let favs = new Set(dnx.store.get("dn-favs", []));

  const stepLabelEl = $("#quizStepLabel");
  const topicEl = $("#quizTopic");
  const answeredCountEl = $("#quizAnsweredCount");
  const progressWrapEl = $("#quizProgressWrap");
  const progressBarEl = $("#quizProgressBar");
  const stepDotsEl = $("#quizStepDots");
  const stageEl = $("#quizStage");
  const questionEl = $("#quizQuestion");
  const optionsEl = $("#quizOptions");
  const prevBtn = $("#prevQuestionBtn");
  const nextBtn = $("#nextQuestionBtn");
  const resetBtn = $("#resetQuizBtn");

  const resultSection = $("#ket-qua");
  const retakeBtn = $("#retakeQuizBtn");
  const copyBtn = $("#copyResultBtn");

  let lastSummaryText = "";

  /* ---------- 6. HIỂN THỊ CÂU HỎI ---------- */
  function renderDots() {
    stepDotsEl.innerHTML = "";
    QUESTIONS.forEach((q, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "quiz-dot";
      if (answers[idx] !== null) dot.classList.add("answered");
      if (idx === currentStep) dot.classList.add("current");
      dot.textContent = String(idx + 1);
      dot.setAttribute("aria-label", `Câu ${idx + 1}: ${answers[idx] !== null ? "đã chọn" : "chưa chọn"}`);
      dot.addEventListener("click", () => {
        currentStep = idx;
        renderQuestion(true);
      });
      stepDotsEl.appendChild(dot);
    });
  }

  function renderQuestion(animate = false) {
    const q = QUESTIONS[currentStep];
    const answeredTotal = answers.filter((a) => a !== null).length;

    stepLabelEl.textContent = `Câu ${currentStep + 1} / ${totalQ}`;
    topicEl.textContent = q.topic;
    answeredCountEl.textContent = `Đã trả lời: ${answeredTotal}/${totalQ}`;

    const pct = ((currentStep + 1) / totalQ) * 100;
    progressBarEl.style.width = `${pct.toFixed(2)}%`;
    progressWrapEl.setAttribute("aria-valuenow", String(currentStep + 1));

    renderDots();

    if (animate) {
      stageEl.style.animation = "none";
      void stageEl.offsetWidth;
      stageEl.style.animation = "";
    }

    questionEl.textContent = `${currentStep + 1}. ${q.question}`;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, optIdx) => {
      const isSelected = answers[currentStep] === optIdx;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option" + (isSelected ? " selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(isSelected));
      btn.dataset.index = String(optIdx);

      btn.innerHTML = `
        <span class="opt-letter">${opt.letter}</span>
        <span class="opt-body">
          <span class="opt-title"><span aria-hidden="true">${opt.icon}</span> ${opt.title}</span>
          <span class="opt-desc">${opt.desc}</span>
        </span>
        <span class="opt-check" aria-hidden="true">✓</span>
      `;

      btn.addEventListener("click", () => selectOption(optIdx));
      optionsEl.appendChild(btn);
    });

    prevBtn.disabled = currentStep === 0;
    if (currentStep === totalQ - 1) {
      nextBtn.textContent = "✨ Xem kết quả gợi ý";
      nextBtn.className = "btn btn-accent";
    } else {
      nextBtn.textContent = "Câu tiếp theo →";
      nextBtn.className = "btn btn-primary";
    }
  }

  function selectOption(optIdx) {
    answers[currentStep] = optIdx;
    dnx.store.set("dn-quiz-answers", answers);
    renderQuestion(false);
  }

  /* ---------- 7. CHẤM ĐIỂM & TẠO GỢI Ý ---------- */
  function computeRecommendations() {
    const traitScores = { nature: 0, fun: 0, culture: 0, garden: 0 };
    const chosenDestTags = new Set();
    const chosenFoodTags = new Set();
    const chosenGiftTags = new Set();
    const chosenArtTags = new Set();
    const destReasonPool = [];
    const foodReasonPool = [];
    const artReasonPool = [];
    const musicReasonPool = [];

    answers.forEach((ansIdx, qIdx) => {
      if (ansIdx === null) return;
      const opt = QUESTIONS[qIdx].options[ansIdx];
      Object.keys(traitScores).forEach((k) => {
        traitScores[k] += opt.scores[k] || 0;
      });
      (opt.tags || []).forEach((t) => chosenDestTags.add(t));
      (opt.foodTags || []).forEach((t) => chosenFoodTags.add(t));
      (opt.giftTags || []).forEach((t) => chosenGiftTags.add(t));
      (opt.artTags || []).forEach((t) => chosenArtTags.add(t));
      if (opt.reasonLabel) destReasonPool.push(opt.reasonLabel);
      if (opt.foodReason) foodReasonPool.push(opt.foodReason);
      if (opt.artReason) artReasonPool.push(opt.artReason);
      if (opt.musicReason) musicReasonPool.push(opt.musicReason);
    });

    const totalTraitPoints = Object.values(traitScores).reduce((s, v) => s + v, 0) || 1;

    // Xác định nhóm sở thích chủ đạo
    const sortedTraits = Object.entries(traitScores).sort((a, b) => b[1] - a[1]);
    const topTraitKey = sortedTraits[0][0];

    // Chấm điểm 12 điểm đến
    const scoredDests = DESTINATIONS.map((dest) => {
      let score = 0;
      Object.keys(traitScores).forEach((k) => {
        score += (traitScores[k] / totalTraitPoints) * (dest.weights[k] || 0) * 10;
      });
      let matchedTags = 0;
      dest.tags.forEach((t) => {
        if (chosenDestTags.has(t)) {
          score += 4.2;
          matchedTags++;
        }
      });
      return { dest, score, matchedTags };
    }).sort((a, b) => b.score - a.score);

    const topDests = scoredDests.slice(0, 3);
    const maxDestScore = topDests[0].score || 1;
    const topRegions = new Set(topDests.slice(0, 2).map((d) => d.dest.region));

    // Chấm điểm 15 đặc sản
    const scoreFoodItem = (item) => {
      let score = 0;
      Object.keys(traitScores).forEach((k) => {
        score += (traitScores[k] / totalTraitPoints) * (item.weights[k] || 0) * 8;
      });
      item.tags.forEach((t) => {
        if (chosenFoodTags.has(t)) score += 6;
        if (chosenGiftTags.has(t)) score += 9;
      });
      const nearTopDest = item.regions.some((r) => topRegions.has(r));
      if (nearTopDest) score += 3.5;
      return { item, score, nearTopDest };
    };

    const topDishes = FOODS.filter((f) => f.category === "mon-an")
      .map(scoreFoodItem)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const topGifts = FOODS.filter((f) => f.category === "qua")
      .map(scoreFoodItem)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);

    const topFoods = [...topDishes, ...topGifts];
    const maxFoodScore = Math.max(...topFoods.map((f) => f.score), 1);

    // Chấm điểm 12 mục Nghệ thuật (chọn 2 Làng nghề + 1 Ca hát)
    const scoreArtItem = (art) => {
      let score = 0;
      Object.keys(traitScores).forEach((k) => {
        score += (traitScores[k] / totalTraitPoints) * (art.weights[k] || 0) * 8;
      });
      art.tags.forEach((t) => {
        if (chosenArtTags.has(t)) score += 7.5;
      });
      const nearTopDest = art.regions.some((r) => topRegions.has(r));
      if (nearTopDest) score += 2.5;
      return { art, score, nearTopDest };
    };

    const topCrafts = ARTS.filter((a) => a.category === "lang-nghe")
      .map(scoreArtItem)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const topMusic = ARTS.filter((a) => a.category === "ca-hat")
      .map(scoreArtItem)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);

    const topArts = [...topCrafts, ...topMusic];
    const maxArtScore = Math.max(...topArts.map((a) => a.score), 1);

    return {
      topTraitKey,
      traitScores,
      totalTraitPoints,
      topDests,
      maxDestScore,
      topFoods,
      maxFoodScore,
      topArts,
      maxArtScore,
      destReasonPool,
      foodReasonPool,
      artReasonPool,
      musicReasonPool,
    };
  }

  function renderResults(scrollToResult = true) {
    const data = computeRecommendations();
    const persona = PERSONAS[data.topTraitKey];

    $("#personaIcon").textContent = persona.icon;
    $("#personaTitle").textContent = persona.title;
    $("#personaSubtitle").textContent = persona.subtitle;
    $("#personaDesc").textContent = persona.desc;

    // Thanh mức độ phù hợp 4 nhóm
    const traitMeta = [
      { key: "nature", label: "🌳 Thiên nhiên & Khám phá" },
      { key: "fun", label: "🎢 Vui chơi & Giải trí" },
      { key: "culture", label: "🛕 Văn hóa – Nghệ thuật" },
      { key: "garden", label: "🍈 Miệt vườn & Ẩm thực" },
    ];
    const traitBarsEl = $("#traitBars");
    traitBarsEl.innerHTML = traitMeta
      .map(({ key, label }) => {
        const pct = Math.round((data.traitScores[key] / data.totalTraitPoints) * 100);
        return `
          <div class="trait-row">
            <div class="trait-row-head"><span>${label}</span><span>${pct}%</span></div>
            <div class="trait-track"><div class="trait-fill" style="width: ${pct}%;"></div></div>
          </div>
        `;
      })
      .join("");

    // Render 3 địa điểm du lịch
    const destGrid = $("#recDestGrid");
    destGrid.innerHTML = "";
    const reasonText = data.destReasonPool.slice(0, 2).join(", ");

    data.topDests.forEach(({ dest, score }, idx) => {
      const matchPct = Math.min(99, Math.max(82, Math.round(84 + (score / data.maxDestScore) * 14 - idx * 3)));
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = dest.id;
      card.innerHTML = `
        <div class="card-media" style="--g1:${dest.g1}; --g2:${dest.g2};">
          <img src="${dest.image}" alt="${dest.title}" loading="lazy">
          <span class="badge">${dest.badge}</span>
          <span class="match-pill">🎯 Phù hợp ${matchPct}%</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${dest.title}</h3>
          <ul class="card-meta">
            ${dest.meta.map((m) => `<li>${m}</li>`).join("")}
          </ul>
          <p class="card-desc">${dest.desc}</p>
          <p class="match-reason">💡 <strong>Vì sao hợp bạn:</strong> Điểm đến ${reasonText || "đúng phong cách bạn chọn"}.</p>
          <div class="card-more" hidden>${dest.moreHtml}</div>
          <div class="card-footer">
            <span class="price-tag">${dest.price}</span>
            <div class="rec-card-actions">
              <a class="rec-link-origin" href="index.html?item=${encodeURIComponent(dest.id)}#diem-den" title="Xem tại trang Du lịch">Mục gốc ↗</a>
              <button class="btn btn-outline btn-detail" type="button">Chi tiết</button>
            </div>
          </div>
        </div>
      `;
      destGrid.appendChild(card);
    });

    // Render 3 món ăn & đặc sản
    const foodGrid = $("#recFoodGrid");
    foodGrid.innerHTML = "";
    favs = new Set(dnx.store.get("dn-favs", []));

    data.topFoods.forEach(({ item, score, nearTopDest }, idx) => {
      const matchPct = Math.min(99, Math.max(84, Math.round(85 + (score / data.maxFoodScore) * 13 - idx * 2)));
      const isFav = favs.has(item.id);
      const specificReason =
        item.category === "qua"
          ? data.foodReasonPool[2] || "món quà đặc sản Đồng Nai ý nghĩa mang về"
          : data.foodReasonPool[0] || "khớp với khẩu vị ẩm thực của bạn";
      const routeBonus = nearTopDest ? " và thuận đường ghé từ điểm đến gợi ý" : "";

      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="card-media" style="--g1:${item.g1}; --g2:${item.g2};">
          <img src="images/${item.id}.jpg" alt="${item.title}" loading="lazy" onerror="this.remove()">
          <span class="badge">${item.badge}</span>
          <span class="card-emoji" aria-hidden="true">${item.emoji}</span>
          <span class="match-pill">🍽️ Hợp vị ${matchPct}%</span>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${item.title}</h3>
            <button class="fav-btn" type="button" aria-label="${isFav ? "Bỏ yêu thích" : "Yêu thích"}" aria-pressed="${isFav}" title="${isFav ? "Bỏ khỏi món yêu thích" : "Lưu món yêu thích"}"><svg class="heart-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button>
          </div>
          <p class="card-desc">${item.desc}</p>
          <p class="match-reason">💡 <strong>Gợi ý:</strong> Chọn vì ${specificReason}${routeBonus}.</p>
          <div class="card-more" hidden>${item.moreHtml}</div>
          <div class="card-footer">
            <span class="price-tag">${item.price}</span>
            <div class="rec-card-actions">
              <a class="rec-link-origin" href="dac-san.html?item=${encodeURIComponent(item.id)}#mon-ngon" title="Xem tại trang Đặc sản">Mục gốc ↗</a>
              <button class="btn btn-outline btn-detail" type="button">Chi tiết</button>
            </div>
          </div>
        </div>
      `;
      foodGrid.appendChild(card);
    });

    // Render 3 nét đẹp Nghệ thuật (2 Làng nghề + 1 Ca hát)
    const artGrid = $("#recArtGrid");
    if (artGrid) {
      artGrid.innerHTML = "";
      data.topArts.forEach(({ art, score }, idx) => {
        const matchPct = Math.min(99, Math.max(85, Math.round(86 + (score / data.maxArtScore) * 12 - idx * 2)));
        const whyArt =
          art.category === "ca-hat"
            ? data.musicReasonPool[0] || "đồng điệu với gu thưởng thức âm nhạc của bạn"
            : data.artReasonPool[idx] || data.artReasonPool[0] || "phù hợp với sở thích khám phá làng nghề của bạn";

        const card = document.createElement("article");
        card.className = "card";
        card.dataset.id = art.id;
        card.innerHTML = `
          <div class="card-media" style="--g1:${art.g1}; --g2:${art.g2};">
            <img src="${art.image}" alt="${art.title}" loading="lazy" onerror="this.remove()">
            <span class="badge">${art.badge}</span>
            <span class="card-emoji" aria-hidden="true">${art.emoji}</span>
            <span class="match-pill">🎨 Hợp gu ${matchPct}%</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${art.title}</h3>
            <ul class="card-meta"><li>${art.meta}</li></ul>
            <p class="card-desc">${art.desc}</p>
            <p class="match-reason">💡 <strong>Vì sao hợp bạn:</strong> Bạn ${whyArt}.</p>
            <div class="card-more" hidden>${art.moreHtml}</div>
            <div class="card-footer">
              <span class="price-tag">${art.subLabel}</span>
              <div class="rec-card-actions">
                <a class="rec-link-origin" href="nghe-thuat.html?art=${encodeURIComponent(art.id)}#${art.anchor}" title="Xem tại trang Nghệ thuật">Mục gốc ↗</a>
                <button class="btn btn-outline btn-detail" type="button">Chi tiết</button>
              </div>
            </div>
          </div>
        `;
        artGrid.appendChild(card);
      });
    }

    // Render lịch trình kết hợp nhanh (Du lịch + Ẩm thực + Nghệ thuật)
    const d1 = data.topDests[0].dest;
    const f1 = data.topFoods[0].item;
    const f2 = data.topFoods[1].item;
    const gift = data.topFoods[2].item;
    const craft1 = data.topArts[0].art;
    const music1 = data.topArts[2].art;

    $("#itineraryTitle").textContent = `Hành trình khám phá ${d1.formName}, vị ngon & hồn nghệ thuật Đồng Nai`;
    $("#itinerarySteps").innerHTML = `
      <li><span class="step-time">Buổi sáng</span><span>Khởi hành đến <strong>${d1.title}</strong> (${d1.meta[1].replace(/^[^\s]+\s/, "")}) để vui chơi, tận hưởng không gian và chụp ảnh.</span></li>
      <li><span class="step-time">Buổi trưa</span><span>Thưởng thức <strong>${f1.title}</strong> (${f1.price}) kết hợp <strong>${f2.title}</strong> chuẩn vị địa phương.</span></li>
      <li><span class="step-time">Buổi chiều</span><span>Tìm hiểu <strong>${craft1.title}</strong> và đắm mình trong không gian <strong>${music1.title}</strong>.</span></li>
      <li><span class="step-time">Quà về</span><span>Mua <strong>${gift.title}</strong> (${gift.price}) về biếu người thân, khép lại chuyến đi trọn vẹn.</span></li>
    `;

    const consultBtn = $("#consultRecBtn");
    consultBtn.href = `index.html?dest=${encodeURIComponent(d1.formName)}#lien-he`;

    lastSummaryText = [
      `🌿 GỢI Ý DU LỊCH, ẨM THỰC & NGHỆ THUẬT ĐỒNG NAI XANH`,
      `Phong cách của tôi: ${persona.title}`,
      `📍 Điểm đến: ${data.topDests.map((x) => x.dest.title).join(" | ")}`,
      `🍲 Ẩm thực & quà: ${data.topFoods.map((x) => x.item.title).join(" | ")}`,
      `🎨 Nghệ thuật: ${data.topArts.map((x) => x.art.title).join(" | ")}`,
    ].join("\n");

    resultSection.hidden = false;
    if (scrollToResult) {
      setTimeout(() => {
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  /* ---------- 8. SỰ KIỆN NÚT ĐIỀU KHIỂN & TƯƠNG TÁC ---------- */
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderQuestion(true);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (answers[currentStep] === null) {
      dnx.showToast("Vui lòng chọn 1 trong 4 đáp án A, B, C hoặc D nhé!", "error");
      return;
    }

    if (currentStep < totalQ - 1) {
      currentStep++;
      renderQuestion(true);
      return;
    }

    // Kiểm tra xem còn câu nào chưa trả lời không
    const firstMissing = answers.findIndex((a) => a === null);
    if (firstMissing !== -1) {
      currentStep = firstMissing;
      renderQuestion(true);
      dnx.showToast(`Bạn còn câu ${firstMissing + 1} chưa chọn đáp án!`, "error");
      return;
    }

    renderResults(true);
    dnx.showToast("🎉 Đã tìm thấy điểm đến, món ngon & nghệ thuật hợp gu bạn!", "success");
  });

  function resetAll(scrollUp = false) {
    answers = Array(totalQ).fill(null);
    dnx.store.set("dn-quiz-answers", answers);
    currentStep = 0;
    resultSection.hidden = true;
    renderQuestion(true);
    if (scrollUp) {
      $("#trac-nghiem").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  resetBtn.addEventListener("click", () => {
    resetAll(false);
    dnx.showToast("Đã làm mới bài trắc nghiệm");
  });

  retakeBtn.addEventListener("click", () => {
    resetAll(true);
  });

  copyBtn.addEventListener("click", () => {
    if (!lastSummaryText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastSummaryText).then(
        () => dnx.showToast("📋 Đã sao chép gợi ý vào bộ nhớ tạm!", "success"),
        () => fallbackCopy(lastSummaryText)
      );
    } else {
      fallbackCopy(lastSummaryText);
    }
  });

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      dnx.showToast("📋 Đã sao chép gợi ý vào bộ nhớ tạm!", "success");
    } catch (e) {
      dnx.showToast("Không thể sao chép tự động.", "error");
    }
    document.body.removeChild(ta);
  }

  // Hỗ trợ bấm phím A/B/C/D hoặc 1/2/3/4 khi đang focus trong vùng trắc nghiệm
  quizApp.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const keyMap = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
    const k = e.key.toLowerCase();
    if (k in keyMap) {
      e.preventDefault();
      selectOption(keyMap[k]);
    }
  });

  // Xử lý nút Xem chi tiết & nút Yêu thích ❤️ ngay trên kết quả gợi ý
  resultSection.addEventListener("click", (e) => {
    const detailBtn = e.target.closest(".btn-detail");
    if (detailBtn) {
      dnx.openModal(detailBtn.closest(".card"));
      return;
    }

    const favBtn = e.target.closest(".fav-btn");
    if (favBtn) {
      const card = favBtn.closest(".card");
      const id = card.dataset.id;
      const name = $(".card-title", card).textContent;
      favs = new Set(dnx.store.get("dn-favs", []));
      if (favs.has(id)) {
        favs.delete(id);
        favBtn.setAttribute("aria-pressed", "false");
        favBtn.setAttribute("aria-label", "Yêu thích");
        favBtn.setAttribute("title", "Lưu món yêu thích");
        dnx.showToast(`Đã bỏ "${name}" khỏi danh sách yêu thích`);
      } else {
        favs.add(id);
        favBtn.setAttribute("aria-pressed", "true");
        favBtn.setAttribute("aria-label", "Bỏ yêu thích");
        favBtn.setAttribute("title", "Bỏ khỏi món yêu thích");
        favBtn.classList.remove("is-fav");
        void favBtn.offsetWidth;
        favBtn.classList.add("is-fav");
        dnx.showToast(`❤️ Đã lưu "${name}" vào mục yêu thích`, "success");
      }
      dnx.store.set("dn-favs", [...favs]);
    }
  });

  /* ---------- 9. KHỞI TẠO ---------- */
  renderQuestion(false);
  // Nếu lần trước người dùng đã hoàn thành đủ 6 câu thì hiển thị sẵn kết quả bên dưới
  if (answers.every((a) => a !== null)) {
    renderResults(false);
  }
})();
