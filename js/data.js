// ============================================================
// data.js  ―  マスタデータ・税額表・定数
// ============================================================

const OTD = {
  company: '株式会社 One Table Design',
  address: '茨城県東茨城郡大洗町港中央9-4',
  tel: '',
  stores: ['本店（えんやどっと丸）', 'パスタのマルコ'],
};

// -------- 従業員マスタ (LocalStorage から復元) --------
const DEFAULT_EMPLOYEES = [
  // 正社員（職能給あり）
  { id:1,  name:'青木 優介',      kana:'アオキ ユウスケ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:375250, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:2,  name:'原 孝志',        kana:'ハラ タカシ',       type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:404800, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:3,  name:'小沼 太一',      kana:'オヌマ タイチ',     type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:4,  name:'石井 眞弓',      kana:'イシイ マユミ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:5,  name:'半谷 和津江',    kana:'ハンヤ カツエ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:6,  name:'武田 あさ子',    kana:'タケダ アサコ',     type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:7,  name:'仲田 友子',      kana:'ナカタ トモコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:8,  name:'石田 良子',      kana:'イシダ ヨシコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:9,  name:'梅原 みゆき',    kana:'ウメハラ ミユキ',   type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:10, name:'勘田 尚人',      kana:'カンダ ナオト',     type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:11, name:'TRAN THI THAO', kana:'',                 type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'本店',  hireDate:'', birthDate:'' },
  { id:12, name:'箕輪 栞',        kana:'ミノワ シオリ',     type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'本店',  hireDate:'', birthDate:'' },
  { id:13, name:'寺山 由紀子',    kana:'テラヤマ ユキコ',   type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:14, name:'ダラガン ジャスミン エデュラン', kana:'', type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:15, name:'エデュラン アイコ', kana:'',              type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:16, name:'SAPKOTA SUSHMA',kana:'',                 type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:17, name:'小島 まゆこ',    kana:'コジマ マユコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:18, name:'大原 瑠奈',      kana:'オオハラ ルナ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:19, name:'檜山 明子',      kana:'ヒヤマ アキコ',     type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:20, name:'直井',           kana:'ナオイ',            type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:21, name:'黒羽',           kana:'クロハ',            type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  // 追加
  { id:22, name:'圷 竜司',        kana:'アクツ リュウジ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  // 役員（給与計算対象外・総支給固定）
  { id:23, name:'清水 佳澄',      kana:'シミズ カスミ',     type:'役員',    dept:'管理',     payType:'役員報酬', baseSalary:0,   hourlyWage:0, commute:0,     positionAllowance:0, targetGross:360000, dependents:0, shakai:'加入', koyo:'未加入', tax:'甲', juminzei:0,   store:'本店',  hireDate:'', birthDate:'' },
  { id:24, name:'清水 裕久',      kana:'シミズ ヒロヒサ',   type:'役員',    dept:'管理',     payType:'役員報酬', baseSalary:0,   hourlyWage:0, commute:0,     positionAllowance:0, targetGross:100000, dependents:0, shakai:'加入', koyo:'未加入', tax:'甲', juminzei:0,   store:'本店',  hireDate:'', birthDate:'' },
];

// -------- 源泉徴収税額表（甲欄 令和8年度） --------
// [以上, 未満, 扶養0人, 1人, 2人, 3人, 4人, 5人, 6人, 7人, 乙欄]
const TAX_TABLE_R8 = [
  [0,105000,0,0,0,0,0,0,0,0,null],
  [105000,107000,170,0,0,0,0,0,0,0,3800],
  [107000,109000,280,0,0,0,0,0,0,0,3800],
  [109000,111000,380,0,0,0,0,0,0,0,3900],
  [111000,113000,480,0,0,0,0,0,0,0,4000],
  [113000,115000,580,0,0,0,0,0,0,0,4100],
  [115000,117000,680,0,0,0,0,0,0,0,4100],
  [117000,119000,790,0,0,0,0,0,0,0,4200],
  [119000,121000,890,0,0,0,0,0,0,0,4300],
  [121000,123000,990,0,0,0,0,0,0,0,4300],
  [123000,125000,1090,0,0,0,0,0,0,0,4400],
  [125000,127000,1190,0,0,0,0,0,0,0,4700],
  [127000,129000,1300,0,0,0,0,0,0,0,5000],
  [129000,131000,1400,0,0,0,0,0,0,0,5300],
  [131000,133000,1500,0,0,0,0,0,0,0,5500],
  [133000,135000,1600,0,0,0,0,0,0,0,5800],
  [135000,137000,1710,0,0,0,0,0,0,0,6100],
  [137000,139000,1810,190,0,0,0,0,0,0,6400],
  [139000,141000,1910,300,0,0,0,0,0,0,6700],
  [141000,143000,2010,400,0,0,0,0,0,0,7000],
  [143000,145000,2110,500,0,0,0,0,0,0,7400],
  [145000,147000,2220,600,0,0,0,0,0,0,7700],
  [147000,149000,2320,700,0,0,0,0,0,0,8000],
  [149000,151000,2420,810,0,0,0,0,0,0,8300],
  [151000,153000,2520,910,0,0,0,0,0,0,8600],
  [153000,155000,2620,1010,0,0,0,0,0,0,8900],
  [155000,157000,2730,1110,0,0,0,0,0,0,9200],
  [157000,159000,2830,1210,0,0,0,0,0,0,9500],
  [159000,161000,2910,1300,0,0,0,0,0,0,9800],
  [161000,163000,2980,1370,0,0,0,0,0,0,10100],
  [163000,165000,3050,1440,0,0,0,0,0,0,10400],
  [165000,167000,3120,1510,0,0,0,0,0,0,10700],
  [167000,169000,3200,1580,0,0,0,0,0,0,11000],
  [169000,171000,3270,1650,0,0,0,0,0,0,11300],
  [171000,173000,3340,1730,100,0,0,0,0,0,11500],
  [173000,175000,3410,1800,170,0,0,0,0,0,11800],
  [175000,177000,3480,1870,250,0,0,0,0,0,12100],
  [177000,179000,3550,1940,320,0,0,0,0,0,12500],
  [179000,181000,3620,2010,390,0,0,0,0,0,12800],
  [181000,183000,3700,2080,460,0,0,0,0,0,13300],
  [183000,185000,3770,2150,530,0,0,0,0,0,14000],
  [185000,187000,3840,2230,600,0,0,0,0,0,14700],
  [187000,189000,3910,2300,670,0,0,0,0,0,15400],
  [189000,191000,3980,2370,750,0,0,0,0,0,16100],
  [191000,193000,4050,2440,820,0,0,0,0,0,16800],
  [193000,195000,4120,2510,890,0,0,0,0,0,17600],
  [195000,197000,4200,2580,960,0,0,0,0,0,18300],
  [197000,199000,4270,2650,1030,0,0,0,0,0,19000],
  [199000,201000,4340,2730,1100,0,0,0,0,0,19700],
  [201000,203000,4410,2800,1170,0,0,0,0,0,20400],
  [203000,205000,4480,2870,1250,0,0,0,0,0,21000],
  [205000,207000,4550,2940,1320,0,0,0,0,0,21700],
  [207000,209000,4630,3010,1390,0,0,0,0,0,22500],
  [209000,211000,4700,3080,1460,0,0,0,0,0,23000],
  [211000,213000,4770,3150,1530,0,0,0,0,0,23600],
  [213000,215000,4840,3230,1600,0,0,0,0,0,24100],
  [215000,217000,4910,3300,1670,0,0,0,0,0,24700],
  [217000,219000,4980,3370,1750,130,0,0,0,0,25300],
  [219000,221000,5050,3440,1820,200,0,0,0,0,25800],
  [221000,224000,5150,3520,1910,300,0,0,0,0,26400],
  [224000,227000,5250,3630,2020,400,0,0,0,0,27500],
  [227000,230000,5360,3740,2120,510,0,0,0,0,28500],
  [230000,233000,5460,3850,2240,610,0,0,0,0,29500],
  [233000,236000,5570,3950,2340,720,0,0,0,0,30500],
  [236000,239000,5680,4060,2450,830,0,0,0,0,31500],
  [239000,242000,5790,4170,2550,940,0,0,0,0,32600],
  [242000,245000,5890,4280,2660,1040,0,0,0,0,33600],
  [245000,248000,6000,4380,2770,1150,0,0,0,0,34600],
  [248000,251000,6110,4490,2880,1260,0,0,0,0,35500],
  [251000,254000,6220,4590,2980,1370,0,0,0,0,36600],
  [254000,257000,6320,4710,3090,1470,0,0,0,0,37600],
  [257000,260000,6430,4810,3200,1580,0,0,0,0,38600],
  [260000,263000,6530,4920,3310,1680,0,0,0,0,39600],
  [263000,266000,6650,5020,3410,1800,170,0,0,0,40600],
  [266000,269000,6750,5140,3520,1900,290,0,0,0,41700],
  [269000,272000,6860,5240,3620,2010,390,0,0,0,42700],
  [272000,275000,6960,5350,3740,2110,500,0,0,0,43700],
  [275000,278000,7080,5450,3840,2230,600,0,0,0,44700],
  [278000,281000,7180,5560,3950,2330,710,0,0,0,45600],
  [281000,284000,7290,5670,4050,2440,820,0,0,0,46700],
  [284000,287000,7390,5780,4170,2540,930,0,0,0,47800],
  [287000,290000,7500,5880,4270,2650,1030,0,0,0,48900],
  [290000,293000,7610,5990,4380,2760,1140,0,0,0,50000],
  [293000,296000,7720,6100,4480,2870,1250,0,0,0,51300],
  [296000,299000,7820,6210,4590,2970,1360,0,0,0,52400],
  [299000,302000,7930,6320,4700,3080,1470,0,0,0,53600],
  [302000,305000,8060,6440,4820,3210,1590,0,0,0,54500],
  [305000,308000,8180,6570,4940,3330,1720,0,0,0,55200],
  [308000,311000,8300,6690,5060,3450,1840,210,0,0,56100],
  [311000,314000,8550,6810,5190,3570,1960,340,0,0,56900],
  [314000,317000,8790,6930,5310,3700,2080,460,0,0,57700],
  [317000,320000,9040,7060,5430,3820,2210,580,0,0,58500],
  [320000,323000,9280,7180,5550,3940,2330,700,0,0,59500],
  [323000,326000,9530,7300,5680,4060,2450,830,0,0,60500],
  [326000,329000,9770,7420,5800,4190,2570,950,0,0,61600],
  [329000,332000,10020,7550,5920,4310,2700,1070,0,0,62600],
  [332000,335000,10260,7670,6040,4430,2820,1190,0,0,63700],
  [335000,338000,10510,7790,6170,4550,2940,1320,0,0,64700],
  [338000,341000,10750,7910,6290,4680,3060,1440,0,0,65800],
  [341000,344000,11000,8040,6410,4800,3190,1560,0,0,66800],
  [344000,347000,11240,8160,6530,4920,3310,1680,0,0,67800],
  [347000,350000,11490,8280,6660,5040,3430,1810,190,0,68800],
  [350000,353000,11730,8500,6780,5170,3550,1930,320,0,69800],
  [353000,356000,11980,8750,6900,5290,3680,2050,440,0,70900],
  [356000,359000,12220,9000,7020,5410,3800,2170,560,0,71900],
  [359000,362000,12470,9240,7150,5530,3920,2300,680,0,72900],
  [362000,365000,12710,9490,7270,5660,4040,2420,810,0,73900],
  [365000,368000,12960,9730,7390,5780,4170,2540,930,0,74900],
  [368000,371000,13200,9980,7510,5900,4290,2660,1050,0,76000],
  [371000,374000,13450,10220,7640,6020,4410,2790,1170,0,76900],
  [374000,377000,13690,10470,7760,6150,4530,2910,1300,0,77800],
  [377000,380000,13940,10710,7880,6270,4660,3030,1420,0,78700],
  [380000,383000,14180,10960,8000,6390,4780,3150,1540,0,79600],
  [383000,386000,14430,11200,8130,6510,4900,3280,1660,0,80600],
  [386000,389000,14670,11450,8250,6640,5020,3400,1790,170,82000],
  [389000,392000,14920,11690,8450,6760,5150,3520,1910,300,83600],
  [392000,395000,15160,11940,8700,6880,5270,3640,2030,420,85400],
  [395000,398000,15410,12180,8940,7000,5390,3770,2150,540,87100],
  [398000,401000,15650,12430,9190,7130,5510,3890,2280,660,88700],
  [401000,404000,15900,12670,9430,7250,5640,4010,2400,790,90500],
  [404000,407000,16140,12920,9680,7370,5760,4140,2520,910,92200],
  [407000,410000,16390,13160,9920,7490,5880,4260,2640,1030,93800],
  [410000,413000,16630,13410,10170,7620,6000,4380,2770,1150,95600],
  [413000,416000,16880,13650,10410,7740,6130,4500,2890,1280,97300],
  [416000,419000,17120,13900,10660,7860,6250,4630,3010,1400,98900],
  [419000,422000,17370,14140,10900,7980,6370,4750,3130,1520,100700],
  [422000,425000,17610,14390,11150,8110,6490,4870,3260,1640,102400],
  [425000,428000,17860,14630,11390,8230,6620,4990,3380,1770,104000],
  [428000,431000,18100,14880,11640,8400,6740,5120,3500,1890,105800],
  [431000,434000,18350,15120,11880,8650,6860,5240,3620,2010,107500],
  [434000,437000,18590,15370,12130,8890,6980,5360,3750,2130,109100],
  [437000,440000,18840,15610,12370,9140,7110,5480,3870,2260,110900],
  [440000,443000,19080,15860,12620,9380,7230,5610,3990,2380,112600],
  [443000,446000,19330,16100,12860,9630,7350,5730,4110,2500,114200],
  [446000,449000,19570,16350,13110,9870,7470,5850,4240,2620,116000],
  [449000,452000,19860,16590,13350,10120,7600,5970,4360,2750,117600],
  [452000,455000,20350,16840,13600,10360,7720,6100,4480,2870,119400],
  [455000,458000,20840,17080,13840,10610,7840,6220,4600,2990,121100],
  [458000,461000,21330,17330,14090,10850,7960,6340,4730,3110,122700],
  [461000,464000,21820,17570,14330,11100,8090,6460,4850,3240,124500],
  [464000,467000,22310,17820,14580,11340,8210,6590,4970,3360,126200],
  [467000,470000,22800,18060,14820,11590,8360,6710,5090,3480,127800],
  [470000,473000,23290,18310,15070,11830,8610,6830,5220,3600,129600],
  [473000,476000,23780,18550,15320,12080,8850,6950,5340,3730,131200],
  [476000,479000,24270,18800,15560,12320,9100,7080,5460,3850,132800],
  [479000,482000,24760,19040,15810,12570,9340,7200,5580,3970,134500],
  [482000,485000,25250,19290,16050,12810,9590,7320,5710,4090,136100],
  [485000,488000,25740,19530,16300,13060,9830,7440,5830,4220,137600],
  [488000,491000,26230,19780,16540,13300,10080,7570,5950,4340,139300],
  [491000,494000,26720,20260,16790,13550,10320,7690,6070,4460,140900],
  [494000,497000,27210,20750,17030,13790,10570,7810,6200,4580,142500],
  [497000,500000,27700,21240,17280,14040,10810,7930,6320,4710,144100],
  [500000,503000,28190,21730,17520,14280,11060,8060,6440,4830,145700],
  [503000,506000,28680,22220,17770,14530,11300,8180,6570,4950,147300],
  [506000,509000,29170,22710,18010,14770,11550,8310,6690,5070,149000],
  [509000,512000,29660,23200,18260,15020,11790,8560,6810,5200,150500],
  [512000,515000,30150,23690,18500,15260,12040,8800,6930,5320,152100],
  [515000,518000,30640,24180,18750,15510,12280,9050,7060,5440,153800],
  [518000,521000,31130,24670,18990,15750,12530,9290,7180,5560,155400],
  [521000,524000,31620,25160,19240,16000,12770,9540,7300,5690,156900],
  [524000,527000,32110,25650,19480,16240,13020,9780,7420,5810,158600],
  [527000,530000,32600,26140,19730,16490,13260,10030,7550,5930,160200],
  [530000,533000,33090,26630,20160,16730,13510,10270,7670,6050,161600],
  [533000,536000,33580,27120,20650,16980,13750,10520,7790,6180,163200],
  [536000,539000,34070,27610,21140,17220,14000,10760,7910,6300,164600],
  [539000,542000,34560,28100,21630,17470,14240,11010,8040,6420,166000],
  [542000,545000,35050,28590,22130,17710,14490,11250,8160,6540,167500],
  [545000,548000,35540,29080,22620,17960,14730,11500,8280,6670,169000],
  [548000,551000,36030,29570,23110,18200,14980,11740,8500,6790,170500],
  [551000,554000,36570,30110,23650,18480,15240,12020,8780,6920,171900],
  [554000,557000,37120,30660,24200,18760,15520,12290,9060,7060,173400],
  [557000,560000,37670,31210,24750,19030,15790,12570,9330,7200,174900],
  [560000,563000,38230,31760,25300,19310,16070,12840,9610,7330,176300],
  [563000,566000,38780,32310,25850,19580,16350,13120,9880,7470,177900],
  [566000,569000,39330,32870,26400,19930,16620,13400,10160,7610,179300],
  [569000,572000,39880,33420,26950,20480,16900,13670,10430,7750,180700],
  [572000,575000,40430,33970,27510,21030,17170,13950,10710,7880,182200],
  [575000,578000,40980,34520,28060,21580,17450,14220,10990,8030,183700],
  [578000,581000,41530,35070,28610,22140,17720,14500,11260,8160,185200],
  [581000,584000,42090,35620,29160,22690,18000,14770,11540,8300,186600],
  [584000,587000,42640,36170,29710,23240,18280,15050,11810,8580,188100],
  [587000,590000,43190,36730,30260,23790,18550,15330,12090,8850,189600],
  [590000,593000,43740,37280,30810,24340,18830,15600,12360,9130,191000],
  [593000,596000,44290,37830,31370,24890,19100,15880,12640,9400,192600],
  [596000,599000,44840,38380,31920,25440,19380,16150,12920,9680,194000],
  [599000,602000,45390,38930,32470,25990,19650,16430,13190,9950,195400],
  [602000,605000,45950,39480,33020,26550,20080,16700,13470,10230,197000],
  [605000,608000,46500,40030,33570,27100,20630,16980,13740,10510,198400],
  [608000,611000,47050,40580,34120,27650,21190,17250,14020,10780,199900],
  [611000,614000,47600,41140,34670,28200,21740,17530,14290,11060,201300],
  [614000,617000,48150,41690,35220,28750,22290,17810,14570,11330,202800],
  [617000,620000,48700,42240,35780,29300,22840,18080,14850,11610,204300],
  [620000,623000,49250,42790,36330,29850,23390,18360,15120,11880,205700],
  [623000,626000,49800,43340,36880,30410,23940,18630,15400,12160,207300],
  [626000,629000,50360,43890,37430,30960,24490,18910,15670,12440,208700],
  [629000,632000,50910,44440,37980,31510,25050,19180,15950,12710,210100],
  [632000,635000,51460,45000,38530,32060,25600,19460,16220,12990,211700],
  [635000,638000,52010,45550,39080,32610,26150,19740,16500,13260,213100],
  [638000,641000,52560,46100,39640,33160,26700,20240,16780,13540,214600],
  [641000,644000,53110,46650,40190,33710,27250,20790,17050,13810,215900],
  [644000,647000,53660,47200,40740,34260,27800,21340,17330,14090,217000],
  [647000,650000,54220,47750,41290,34820,28350,21890,17600,14370,218000],
  [650000,653000,54770,48300,41840,35370,28900,22440,17880,14640,219000],
  [653000,656000,55320,48850,42390,35920,29460,22990,18150,14920,220000],
  [656000,659000,55870,49410,42940,36470,30010,23540,18430,15190,221000],
  [659000,662000,56420,49960,43490,37020,30560,24100,18700,15470,222100],
  [662000,665000,56970,50510,44050,37570,31110,24650,18980,15740,223100],
  [665000,668000,57520,51060,44600,38120,31660,25200,19260,16020,224100],
  [668000,671000,58070,51610,45150,38680,32210,25750,19530,16300,225000],
  [671000,674000,58630,52160,45700,39230,32760,26300,19830,16570,226000],
  [674000,677000,59180,52710,46250,39780,33320,26850,20380,16850,227100],
  [677000,680000,59730,53270,46800,40330,33870,27400,20930,17120,228100],
  [680000,683000,60280,53820,47350,40880,34420,27950,21480,17400,229100],
  [683000,686000,60830,54370,47910,41430,34970,28510,22030,17670,230100],
  [686000,689000,61380,54920,48460,41980,35520,29060,22580,17950,231500],
  [689000,692000,61930,55470,49010,42530,36070,29610,23140,18220,233000],
  [692000,695000,62490,56020,49560,43090,36620,30160,23690,18500,234500],
  [695000,698000,63040,56570,50110,43640,37170,30710,24240,18780,236100],
  [698000,701000,63590,57120,50660,44190,37730,31260,24790,19050,237600],
  [701000,704000,64140,57680,51210,44740,38280,31810,25340,19330,239100],
  [704000,707000,64690,58230,51760,45290,38830,32370,25890,19600,240800],
  [707000,710000,65250,58780,52320,45850,39380,32920,26450,19980,242300],
  [710000,713000,65860,59390,52930,46470,39990,33530,27070,20590,243800],
  [713000,716000,66480,60000,53540,47080,40610,34140,27680,21210,245300],
  [716000,719000,67090,60620,54150,47690,41220,34750,28290,21820,246900],
  [719000,722000,67700,61230,54770,48300,41830,35370,28900,22430,248400],
  [722000,725000,68320,61840,55380,48920,42440,35980,29520,23040,250000],
  [725000,728000,68930,62450,55990,49530,43060,36590,30130,23660,251600],
  [728000,731000,69540,63070,56600,50140,43670,37210,30740,24270,253100],
  [731000,734000,70150,63680,57220,50750,44280,37820,31350,24880,254600],
  [734000,737000,70770,64290,57830,51370,44890,38430,31970,25490,256200],
  [737000,740000,71380,64900,58440,51980,45510,39040,32580,26110,257700],
  // 740,000円以上：速算式で計算（別途）
];

// 乙欄（740,000円以上は給与×3.063%）
const TAX_OTU_RATE_HIGH = 0.03063;

// -------- 健康保険・厚生年金（全国健康保険協会 茨城支部 2025年度） --------
// 健康保険（介護保険第2号被保険者以外）: 10.06% → 本人5.03%
// 健康保険（介護保険第2号被保険者・40歳〜64歳）: 11.86% → 本人5.93%
// 厚生年金: 18.30% → 本人9.15%
// 令和8年度（2026年3月分〜）協会けんぽ茨城支部
const KENPO_RATE       = 0.0476; // 健保（介護なし）茨城支部 9.52%÷2
const KENPO_KAIGO_RATE = 0.0557; // 健保（介護あり・40〜64歳）(9.52+1.62)%÷2
const KOSEI_RATE       = 0.0915; // 厚生年金 18.30%÷2（変更なし）
const SHIENKIN_RATE    = 0.00115; // 子ども・子育て支援金（0.23%÷2）2026年5月納付分〜

// 年齢から介護保険対象かどうかを判定（40歳以上65歳未満）
function isKaigoTarget(birthDateStr) {
  if (!birthDateStr) return false;
  const birth = new Date(birthDateStr);
  const today = new Date();
  const age   = today.getFullYear() - birth.getFullYear()
    - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  return age >= 40 && age < 65;
}

// 健保・厚年 標準報酬月額等級表（報酬月額 → 標準報酬月額）
// 健保50等級、報酬月額の範囲 → 標準報酬月額
const KENPO_GRADE_TABLE = [
  [0,63000,58000],[63000,73000,68000],[73000,83000,78000],[83000,93000,88000],
  [93000,101000,98000],[101000,107000,104000],[107000,114000,110000],[114000,122000,118000],
  [122000,130000,126000],[130000,138000,134000],[138000,146000,142000],[146000,155000,150000],
  [155000,165000,160000],[165000,175000,170000],[175000,185000,180000],[185000,195000,190000],
  [195000,210000,200000],[210000,230000,220000],[230000,250000,240000],[250000,270000,260000],
  [270000,290000,280000],[290000,310000,300000],[310000,330000,320000],[330000,350000,340000],
  [350000,370000,360000],[370000,395000,380000],[395000,425000,410000],[425000,455000,440000],
  [455000,485000,470000],[485000,515000,500000],[515000,545000,530000],[545000,575000,560000],
  [575000,605000,590000],[605000,635000,620000],[635000,665000,650000],[665000,695000,680000],
  [695000,730000,710000],[730000,770000,750000],[770000,810000,790000],[810000,855000,830000],
  [855000,905000,880000],[905000,955000,930000],[955000,1005000,980000],[1005000,1055000,1030000],
  [1055000,1115000,1090000],[1115000,1175000,1150000],[1175000,1235000,1210000],[1235000,1295000,1270000],
  [1295000,1355000,1330000],[1355000,Infinity,1390000],
];
function getHyojunKenpo(reportMonthly) {
  for (const [min, max, std] of KENPO_GRADE_TABLE) {
    if (reportMonthly >= min && reportMonthly < max) return std;
  }
  return Math.round(reportMonthly / 1000) * 1000;
}

// 社会保険料計算（標準報酬月額ベース）
// hyojunFixed: 従業員マスタの固定標準報酬月額（設定済みの場合はこちらを優先）
function calcShakai(grossForShakai, birthDateStr = '', hyojunFixed = 0) {
  // 固定値があればそれを使う・なければ等級表で判定
  const hyojun = hyojunFixed > 0
    ? hyojunFixed
    : getHyojunKenpo(grossForShakai);
  const kaigo  = isKaigoTarget(birthDateStr);
  const kenpo  = Math.round(hyojun * (kaigo ? KENPO_KAIGO_RATE : KENPO_RATE));
  const kosei  = Math.round(hyojun * KOSEI_RATE);
  // 子ども・子育て支援金（2026年4月分〜・社保加入者のみ・標準報酬月額ベース）
  const shienkin = Math.round(hyojun * SHIENKIN_RATE);
  return { kenpo, kosei, kaigo, shienkin, hyojun };
}

// 雇用保険料率（2025年度〜）: 一般事業 本人負担 5/1000
const KOYO_RATE = 0.005;

// -------- 所得税計算 --------
function calcIncomeTax(taxableGross, dependents = 0, taxType = '甲') {
  if (taxableGross <= 0) return 0;
  const dep = Math.min(Math.max(parseInt(dependents) || 0, 0), 7);

  // 乙欄
  if (taxType === '乙') {
    if (taxableGross < 105000) return Math.round(taxableGross * 0.03063);
    for (const row of TAX_TABLE_R8) {
      if (taxableGross >= row[0] && taxableGross < row[1]) {
        const otuBase = row[10];
        if (otuBase === null) return Math.round(taxableGross * 0.03063);
        return otuBase;
      }
    }
    return Math.round(taxableGross * TAX_OTU_RATE_HIGH);
  }

  // 甲欄（令和8年度）
  if (taxableGross < 105000) return 0;
  for (const row of TAX_TABLE_R8) {
    if (taxableGross >= row[0] && taxableGross < row[1]) {
      // row[2]〜row[9] = 扶養0〜7人
      const base = row[2 + dep];
      // 扶養7人超: 7人の金額から1人ごとに1,610円控除
      const extra = dep > 7 ? (dep - 7) * 1610 : 0;
      return Math.max(0, base - extra);
    }
  }
  // 740,000円以上は速算式（簡易）
  return Math.round(taxableGross * 0.3321 - 352500);
}

// -------- 給与締め・支払・休日設定 --------
const PAY_CONFIG = {
  cutoffDay: 20,       // 締め日（20日）
  payDay: 'lastDay',   // 支払日: 'lastDay'=末日, または数値(例: 25)
  legalHolidayDow: 4,  // 法定休日の曜日: 0=日,1=月,2=火,3=水,4=木,5=金,6=土 → 4=木曜
  nonLegalHolidayDow: 3, // 法定外休日の曜日 → 3=水曜
};

const DOW_NAMES = ['日','月','火','水','木','金','土'];

// 給与計算期間の開始・終了日を返す
// 例: year=2026, month=6 → 2026/5/21 〜 2026/6/20
function getPayPeriod(year, month) {
  const cutoff = PAY_CONFIG.cutoffDay;
  // 開始: 前月(month-1)の締め日翌日
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear  = month === 1 ? year - 1 : year;
  const startDate = `${prevYear}-${String(prevMonth).padStart(2,'0')}-${String(cutoff + 1).padStart(2,'0')}`;
  // 終了: 当月締め日
  const endDate   = `${year}-${String(month).padStart(2,'0')}-${String(cutoff).padStart(2,'0')}`;
  // 支払日
  let payDateStr;
  if (PAY_CONFIG.payDay === 'lastDay') {
    const lastDay = new Date(year, month, 0).getDate();
    payDateStr = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
  } else {
    payDateStr = `${year}-${String(month).padStart(2,'0')}-${String(PAY_CONFIG.payDay).padStart(2,'0')}`;
  }
  return { startDate, endDate, payDateStr };
}

// 日付が給与計算期間内かどうかを判定
function isInPayPeriod(dateStr, year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  return dateStr >= startDate && dateStr <= endDate;
}

// -------- Firebase 初期化 --------
const firebaseConfig = {
  apiKey: "AIzaSyA3YVQwyAudMEZJs_rfEW8IHfxh4Grvlbw",
  authDomain: "wcsa-shift.firebaseapp.com",
  databaseURL: "https://wcsa-shift-default-rtdb.firebaseio.com",
  projectId: "wcsa-shift",
  storageBucket: "wcsa-shift.firebasestorage.app",
  messagingSenderId: "521554404721",
  appId: "1:521554404721:web:f59a570dd7e10f3aed82d0"
};

// Firebase が未初期化の場合のみ初期化
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// -------- Firebase パス --------
const FB = {
  employees:  () => db.ref('payroll/employees'),
  attendance: () => db.ref('payroll/attendance'),
  paidLeave:  () => db.ref('payroll/paidLeave'),
  article36:  () => db.ref('payroll/article36'),
  salaryAdj:  (ym) => db.ref(`payroll/salaryAdj/${ym}`),
};

// -------- State --------
let employees  = [];
let attendance = {};
let paidLeave  = {};
let article36  = {};
let salaryAdj  = {}; // 給与調整値 { ym: { empId: { field: value } } }
let _fbLoaded  = false; // 初回ロード完了フラグ

// -------- 給与調整値 API --------
function getAdj(year, month, empId) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  return (salaryAdj[ym] || {})[empId] || {};
}

function setAdj(year, month, empId, field, value) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  if (!salaryAdj[ym]) salaryAdj[ym] = {};
  if (!salaryAdj[ym][empId]) salaryAdj[ym][empId] = {};
  salaryAdj[ym][empId][field] = value;
  FB.salaryAdj(ym).child(String(empId)).update({ [field]: value });
}

// 調整値を適用して給与を再計算
function calcSalaryWithAdj(emp, year, month) {
  const sal = calcSalary(emp, year, month);
  const adj = getAdj(year, month, emp.id);
  if (!adj || Object.keys(adj).length === 0) return sal;

  // 各項目に調整値を上書き
  const fields = ['basePay','skillPay','positionAllowancePay','otPay','midnightPay',
    'holidayLegalPay','commute','kenpo','kosei','shienkin','koyoHoken',
    'incomeTax','juminzei','chutaikyoAmount'];
  for (const f of fields) {
    if (adj[f] !== undefined) sal[f] = adj[f];
  }

  // 支給合計・控除合計・振込額を再計算
  sal.grossTotal    = sal.basePay + sal.skillPay + sal.positionAllowancePay
    + sal.otPay + sal.midnightPay + sal.holidayLegalPay + sal.commute;
  sal.totalDeduction = sal.kenpo + sal.kosei + sal.shienkin + sal.koyoHoken
    + sal.incomeTax + sal.juminzei + sal.chutaikyoAmount;
  sal.netPay = Math.round(sal.grossTotal - sal.totalDeduction);
  return sal;
}

// salaryAdj の Firebase 購読（月が変わった時に呼ぶ）
let _adjUnsub = null;
function subscribeAdj(year, month) {
  if (_adjUnsub) _adjUnsub();
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  const ref = FB.salaryAdj(ym);
  const handler = snap => {
    salaryAdj[ym] = snap.val() || {};
    if (_fbLoaded && ['salary','payslip','dashboard'].includes(currentPage)) refreshCurrentPageData();
  };
  ref.on('value', handler);
  _adjUnsub = () => ref.off('value', handler);
}

// 在籍中スタッフのみ
function activeEmployees() {
  return employees.filter(e => e.status !== 'inactive' && e.status !== 'leave');
}

// -------- Firebase 読み込み・リアルタイム購読 --------

// Firebase更新時にページ全体を再描画せず必要部分だけ更新する
function refreshCurrentPageData() {
  switch (currentPage) {
    case 'attendance':
      if (typeof renderAttendanceTable === 'function') {
        const y = parseInt(document.getElementById('targetYear')?.value);
        const m = parseInt(document.getElementById('targetMonth')?.value);
        if (!isNaN(y) && !isNaN(m)) setTimeout(() => renderAttendanceTable(y, m), 0);
      }
      break;
    case 'weekly':
      if (typeof renderWeekDetail === 'function') {
        const y = parseInt(document.getElementById('targetYear')?.value);
        const m = parseInt(document.getElementById('targetMonth')?.value);
        if (!isNaN(y) && !isNaN(m)) setTimeout(() => renderWeekDetail(y, m), 0);
      }
      break;
    case 'monthly':
    case 'employees':
    case 'dashboard':
    case 'salary':
    case 'payslip':
    case 'paid_leave':
    case 'article36':
    case 'labor_report':
    case 'freelance':
      renderPage(currentPage);
      break;
    default:
      break;
  }
}

function initFirebaseData() {
  showLoadingOverlay(true);

  // 4つのノードを並行購読
  let loaded = 0;
  const onLoad = () => { if (++loaded >= 4) { showLoadingOverlay(false); _fbLoaded = true; renderPage(currentPage); } };

  FB.employees().on('value', snap => {
    const val = snap.val();
    if (val) {
      employees = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
      // order フィールドがなければ id で補完してから order でソート
      employees.forEach((e, i) => { if (e.order === undefined) e.order = e.id * 10; });
      employees.sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id));
    } else {
      const empObj = {};
      DEFAULT_EMPLOYEES.forEach((e, i) => { empObj[e.id] = { ...e, order: i * 10 }; });
      FB.employees().set(empObj);
      employees = DEFAULT_EMPLOYEES.map((e, i) => ({ ...e, order: i * 10 }));
    }
    if (!_fbLoaded) {
      onLoad();
    } else {
      // employees更新時：ページ全体を再描画せずデータだけ反映
      // ページ内の必要な部分だけ更新してちらつきを防ぐ
      refreshCurrentPageData();
      showToast('データが更新されました ✓');
    }
  });

  FB.attendance().on('value', snap => {
    attendance = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'attendance' || currentPage === 'weekly' || currentPage === 'monthly') refreshCurrentPageData();
  });

  FB.paidLeave().on('value', snap => {
    paidLeave = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'paid_leave') refreshCurrentPageData();
  });

  FB.article36().on('value', snap => {
    article36 = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'article36') refreshCurrentPageData();
  });
}

// -------- 保存関数（Firebase書き込み） --------
function saveData() {
  const empObj = {};
  employees.forEach(e => { empObj[e.id] = e; });
  FB.employees().set(empObj);
  FB.attendance().set(attendance);
  FB.paidLeave().set(paidLeave);
  FB.article36().set(article36);
  showToast('保存しました ✓');
}

// 個別保存ヘルパー
function saveLS(key, val) {
  // Firebase に保存（後方互換のため関数名は保持）
  if (key === 'employees') {
    const empObj = {};
    val.forEach(e => { empObj[e.id] = e; });
    FB.employees().set(empObj);
  } else if (key === 'attendance') {
    FB.attendance().set(val);
  } else if (key === 'paidLeave') {
    FB.paidLeave().set(val);
  } else if (key === 'article36') {
    FB.article36().set(val);
  }
}

// ローディングオーバーレイ
function showLoadingOverlay(show) {
  let el = document.getElementById('fbLoadingOverlay');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'fbLoadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,25,35,0.85);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:inherit';
    el.innerHTML = '<div style="font-size:28px;margin-bottom:12px">⏳</div><div style="font-size:15px;font-weight:600">データを読み込み中...</div><div style="font-size:12px;color:#888;margin-top:6px">Firebase に接続しています</div>';
    document.body.appendChild(el);
  }
  if (el) el.style.display = show ? 'flex' : 'none';
}

// -------- Util --------
function getYM(year, month) {
  return `${year}-${String(month).padStart(2,'0')}`;
}

// 指定年月の打刻データを取得
function getMonthAttendance(year, month, empId) {
  const ym = getYM(year, month);
  return (attendance[ym] && (attendance[ym][empId] || attendance[ym][String(empId)])) || {};
}

// 週マタギ残業計算（日8h超・週40h超・月60h超・深夜・休日 完全対応）
//
// 【割増率一覧】
//   日8h超残業（dailyOT）      → +25%
//   週40h超残業（weekOT）      → +25%（日8h超と重複しない）
//   月60h超残業               → さらに+25%（合計+50%）
//   深夜のみ（midnight）       → +25%
//   深夜かつ残業（midnightOT） → +25%+25%=+50%（残業割増と深夜割増が合算）
//   深夜かつ月60h超残業        → +50%+25%=+75%
//   法定休日（holidayLegal）   → +35%（深夜なら+60%）週40h計算から除外
//   法定外休日（holidayNonLegal）→ 通常賃金。週40h超分は残業として計算
//
// 入力フィールド:
//   actual        : その日の実労働時間合計（h）
//   dailyOT       : 日8h超の残業時間（h）
//   midnight      : 22時〜5時の労働時間合計（h）
//   midnightOT    : 22時〜5時 かつ 残業（日8h超 or 週40h超）の時間（h）
//   holidayLegal  : 法定休日（木曜）実働時間（h）
//   holidayNonLegal:法定外休日（水曜）実働時間（h）
function calcWeeklyOT(dailyList, year, month) {
  if (!dailyList.length) return {
    weeks:[], monthOT:0, monthDailyOT:0, monthWeekOT:0,
    monthMidnight:0, monthMidnightOT:0,
    monthHolidayLegal:0, monthHolidayNonLegal:0,
    monthHoliday:0, totalActual:0
  };

  const byWeek = {};
  for (const d of dailyList) {
    const dt  = new Date(d.date);
    const day = dt.getDay() || 7;
    const monday = new Date(dt);
    monday.setDate(dt.getDate() - day + 1);
    const wk = monday.toISOString().slice(0,10);
    if (!byWeek[wk]) byWeek[wk] = { start: wk, days: [] };
    byWeek[wk].days.push(d);
  }

  let monthOT=0, monthDailyOT=0, monthWeekOT=0;
  let monthMidnight=0, monthMidnightOT=0;
  let monthHolidayLegal=0, monthHolidayNonLegal=0, totalActual=0;
  const weeks = [];

  for (const [wkStart, wkData] of Object.entries(byWeek).sort()) {
    const endDt = new Date(wkStart);
    endDt.setDate(endDt.getDate() + 6);
    const wkEnd = endDt.toISOString().slice(0,10);

    let wkActualMins=0, wkDailyOTMins=0, wkMidnightMins=0, wkMidnightOTMins=0;
    let wkHolidayLegalMins=0, wkHolidayNonLegalMins=0;

    for (const d of wkData.days) {
      // 週マタギ計算でも給与期間内の日だけを集計（期間外データの影響を排除）
      if (!isInPayPeriod(d.date, year, month)) continue;
      wkActualMins          += Math.round((d.actual       ||0) * 60); // 分単位精度
      wkDailyOTMins         += Math.round((d.dailyOT      ||0) * 60);
      wkMidnightMins        += Math.round((d.midnight     ||0) * 60);
      wkMidnightOTMins      += Math.round((d.midnightOT   ||0) * 60);
      wkHolidayLegalMins    += Math.round((d.holidayLegal ||0) * 60);
      wkHolidayNonLegalMins += Math.round((d.holidayNonLegal||0) * 60);
      if (d.holiday && !d.holidayLegal && !d.holidayNonLegal) wkHolidayNonLegalMins += Math.round((d.holiday||0) * 60);
    }
    // 分単位 → h変換
    const wkActual          = wkActualMins          / 60;
    const wkDailyOT         = wkDailyOTMins         / 60;
    const wkMidnight        = wkMidnightMins        / 60;
    const wkMidnightOT      = wkMidnightOTMins      / 60;
    const wkHolidayLegal    = wkHolidayLegalMins    / 60;
    const wkHolidayNonLegal = wkHolidayNonLegalMins / 60;

    // 週40h超残業：日8h超分を除いた純週残業
    const wkWeekOT = Math.max(0, wkActual - 40 - wkDailyOT);
    const wkOT = wkDailyOT + wkWeekOT;

    // 期間内の日だけで集計済みなのでratioは使わず直接加算
    const wkWeekOTMins = Math.max(0, wkActualMins - 40*60 - wkDailyOTMins);
    monthOT              += (wkDailyOTMins + wkWeekOTMins) / 60;
    monthDailyOT         += wkDailyOTMins         / 60;
    monthWeekOT          += wkWeekOTMins           / 60;
    monthMidnight        += wkMidnightMins         / 60;
    monthMidnightOT      += wkMidnightOTMins       / 60;
    monthHolidayLegal    += wkHolidayLegalMins     / 60;
    monthHolidayNonLegal += wkHolidayNonLegalMins  / 60;
    const daysInPeriod = wkData.days.filter(d => isInPayPeriod(d.date, year, month)).length;

    const actualInPeriod = wkData.days
      .filter(d => isInPayPeriod(d.date, year, month))
      .reduce((s,d) => s + Math.round((d.actual||0) * 60), 0); // 分単位で集計
    totalActual += actualInPeriod;

    weeks.push({ start:wkStart, end:wkEnd, actual:wkActual,
      dailyOT:wkDailyOT, weekOT:wkWeekOT, overtime:wkOT,
      midnight:wkMidnight, midnightOT:wkMidnightOT,
      holidayLegal:wkHolidayLegal, holidayNonLegal:wkHolidayNonLegal, daysInPeriod });
  }

  // 分単位精度でhに変換（×60/60で誤差なし）
  const rm = v => Math.round(v * 60) / 60;
  return {
    weeks,
    monthOT:              rm(monthOT),
    monthDailyOT:         rm(monthDailyOT),
    monthWeekOT:          rm(monthWeekOT),
    monthMidnight:        rm(monthMidnight),
    monthMidnightOT:      rm(monthMidnightOT),
    monthHolidayLegal:    rm(monthHolidayLegal),
    monthHolidayNonLegal: rm(monthHolidayNonLegal),
    monthHoliday:         rm(monthHolidayLegal + monthHolidayNonLegal),
    totalActual:          totalActual / 60, // 分単位集計→h変換（誤差なし）
  };
}

// 給与計算期間（前月21日〜当月20日）＋週マタギのため前後1週間を含む打刻を取得
// punchOut から midnight/dailyOT をリアルタイム再計算（Firebase保存値の精度誤差を上書き）
function recomputeRec(rec) {
  if (!rec.punchIn || !rec.punchOut) return rec;
  const toMins = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
  const outMins = toMins(rec.punchOut);
  let midnightMins = 0;
  if (outMins >= 22*60) midnightMins = outMins - 22*60;
  else if (outMins < 5*60) midnightMins = outMins + 2*60;
  const midnight = Math.round(midnightMins) / 60;
  const dailyOTMins = Math.max(0, Math.round((rec.actual||0) * 60) - 480);
  const dailyOT = dailyOTMins / 60;
  const midnightOT = Math.min(midnight, dailyOT);
  return { ...rec, midnight, dailyOT, midnightOT };
}

function getExtendedDailyList(empId, year, month) {
  const list = [];
  const { startDate, endDate } = getPayPeriod(year, month);

  // 週マタギのため、給与期間の前後1週間（7日）だけを取得範囲とする
  // 期間外の過去データを大量に入れても週超計算が変わらないようにする
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const rangeStart = new Date(start); rangeStart.setDate(rangeStart.getDate() - 6);
  const rangeEnd   = new Date(end);   rangeEnd.setDate(rangeEnd.getDate() + 6);

  // スキャン対象月を絞る（前月・当月・翌月の3ヶ月だけ）
  const prev = month === 1 ? [year-1, 12] : [year, month-1];
  const next = month === 12 ? [year+1, 1] : [year, month+1];
  const monthsToScan = [prev, [year, month], next];

  for (const [y,m] of monthsToScan) {
    const ym = getYM(y,m);
    const empData = (attendance[ym] && attendance[ym][empId]) || {};
    for (const [date, rec] of Object.entries(empData)) {
      // 取得範囲外のデータは無視
      const d = new Date(date);
      if (d < rangeStart || d > rangeEnd) continue;

      const existing = list.findIndex(d=>d.date===date);
      if (existing === -1) {
        list.push({ date, ...recomputeRec(rec) });
      } else if (rec.source === 'csv' || rec.source === 'timecard') {
        list[existing] = { date, ...recomputeRec(rec) };
      }
    }
  }
  return list.sort((a,b)=>a.date.localeCompare(b.date));
}

// 月次サマリ取得（週マタギ計算込み・給与計算期間基準）
function getMonthSummary(empId, year, month) {
  const extended = getExtendedDailyList(empId, year, month);
  const result = calcWeeklyOT(extended, year, month);

  // 勤怠入力ページと一致させるため 期間内の日を直接合算
  const { startDate, endDate } = getPayPeriod(year, month);
  const start = new Date(startDate);
  const end   = new Date(endDate);

  // empMapを構築（recomputeRec済みのextendedから）
  const empMap = {};
  for (const d of extended) empMap[d.date] = d;

  let sumActualMins = 0, sumDailyOTMins = 0;
  let sumMidnightMins = 0, sumMidnightOTMins = 0;
  let sumHolidayLegalMins = 0, sumHolidayNonLegalMins = 0;
  let workDays = 0, paidDays = 0, absentDays = 0, lateDays = 0;

  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const d = empMap[dt.toISOString().slice(0,10)] || {};
    sumActualMins          += Math.round((d.actual          ||0) * 60);
    sumDailyOTMins         += Math.round((d.dailyOT         ||0) * 60);
    sumMidnightMins        += Math.round((d.midnight        ||0) * 60);
    sumMidnightOTMins      += Math.round((d.midnightOT      ||0) * 60);
    sumHolidayLegalMins    += Math.round((d.holidayLegal    ||0) * 60);
    sumHolidayNonLegalMins += Math.round((d.holidayNonLegal ||0) * 60);
    if (d.actual > 0) workDays++;
    if (d.paidLeave) paidDays++;
    if (d.absent) absentDays++;
    if (d.late > 0) lateDays++;
  }

  const totalActual      = sumActualMins          / 60;
  const monthDailyOT     = sumDailyOTMins         / 60;
  const monthMidnight    = sumMidnightMins        / 60;
  const monthMidnightOT  = sumMidnightOTMins      / 60;
  const monthHolidayLegal    = sumHolidayLegalMins    / 60;
  const monthHolidayNonLegal = sumHolidayNonLegalMins / 60;
  // 週超残業 = calcWeeklyOTの総残業 - 直接合算の日超（勤怠入力ページと同じ計算）
  const monthWeekOT      = Math.max(0, result.monthOT - monthDailyOT);
  const monthOT          = monthDailyOT + monthWeekOT;

  return {
    ...result,
    totalActual, monthOT, monthDailyOT, monthWeekOT,
    monthMidnight, monthMidnightOT,
    monthHolidayLegal, monthHolidayNonLegal,
    monthHoliday: monthHolidayLegal + monthHolidayNonLegal,
    workDays, paidDays, absentDays, lateDays
  };
}

// 給与計算本体
function calcSalary(emp, year, month) {

  // ── 役員：固定総支給のみ ──────────────────────────
  if (emp.payType === '役員報酬') {
    const grossTotal = emp.targetGross || 0;
    let kenpo = 0, kosei = 0, shienkin = 0;
    if (emp.shakai === '加入') {
      const s = calcShakai(grossTotal, emp.birthDate, emp.hyojunHoshu || 0);
      kenpo = s.kenpo; kosei = s.kosei; shienkin = s.shienkin;
    }
    const incomeTax      = calcIncomeTax(grossTotal - kenpo - kosei - shienkin, emp.dependents, emp.tax);
    const juminzei       = emp.juminzei || 0;
    const totalDeduction = kenpo + kosei + shienkin + incomeTax + juminzei;
    const netPay         = Math.round(grossTotal - totalDeduction);
    return {
      basePay: grossTotal, skillPay: 0, skillPayNote: '役員報酬（固定）',
      positionAllowancePay: 0, otPay: 0, midnightPay: 0,
      midnightOnlyPay: 0, midnightOTPay: 0,
      holidayLegalPay: 0, holidayNonLegalPay: 0, holidayPay: 0,
      commute: 0, commuteNote: '', grossTotal, kenpo, kosei, shienkin, koyoHoken: 0,
      incomeTax, juminzei, totalDeduction, netPay,
      kaigo: isKaigoTarget(emp.birthDate),
      monthOT:0, monthDailyOT:0, monthWeekOT:0,
      monthMidnight:0, monthMidnightOT:0,
      monthHolidayLegal:0, monthHolidayNonLegal:0, monthHoliday:0,
      totalActual:0, workDays:0, paidDays:0, absentDays:0,
      hourlyBase:0, ot60under:0, ot60over:0,
    };
  }

  const summary = getMonthSummary(emp.id, year, month);
  const {
    monthOT, monthDailyOT, monthWeekOT,
    monthMidnight, monthMidnightOT,
    monthHolidayLegal, monthHolidayNonLegal,
    totalActual, workDays, paidDays, absentDays
  } = summary;

  let basePay = 0, hourlyBase = 0;

  if (emp.payType === '月給') {
    const MONTHLY_HOURS = emp.monthlyHours || 173.8; // 月平均所定労働時間（デフォルト173.8h）
    hourlyBase = emp.baseSalary / MONTHLY_HOURS;
    basePay = emp.baseSalary - absentDays * 8 * hourlyBase;
  } else {
    hourlyBase = emp.hourlyWage;
    basePay = totalActual * hourlyBase;
  }

  const h = hourlyBase;

  // 役職手当
  const positionAllowancePay = emp.positionAllowance || 0;

  // ── 通勤手当（日額×出勤日数 or 月額固定）──────────
  const actualCommute = emp.commuteType === 'daily'
    ? (emp.commutePerDay || 0) * workDays
    : (emp.commute || 0);

  // 残業手当（月60h以内25%、60h超50%）
  const ot60under = Math.min(monthOT, 60);
  const ot60over  = Math.max(0, monthOT - 60);
  const otPay     = ot60under * h * 0.25 + ot60over * h * 0.50;

  // 深夜手当
  const midnightOnly    = monthMidnight - monthMidnightOT;
  const midnightOnlyPay = midnightOnly * h * 0.25;
  const midnightOT60u   = Math.min(monthMidnightOT, 60);
  const midnightOT60o   = Math.max(0, monthMidnightOT - 60);
  const midnightOTPay   = midnightOT60u * h * 0.25 + midnightOT60o * h * 0.25;
  const midnightPay     = midnightOnlyPay + midnightOTPay;

  // 法定休日手当
  const holidayLegalPay = monthHolidayLegal * h * 0.35;

  // ── 職能給の計算 ──────────────────────────────────
  // 職能給 = 目標総支給 - 基本給 - 通勤手当 - 役職手当 - 残業代合計
  let skillPay = 0, skillPayNote = '';
  if (emp.payType === '月給' && emp.targetGross > 0) {
    const otTotal = Math.round(otPay + midnightPay + holidayLegalPay);
    skillPay = emp.targetGross - emp.baseSalary - actualCommute - positionAllowancePay - otTotal;
    skillPay = Math.max(0, Math.round(skillPay));
    skillPayNote = `目標¥${emp.targetGross.toLocaleString()} - 基本給 - 通勤 - 役職 - 残業`;
  }

  const grossTotal = Math.round(basePay + skillPay + positionAllowancePay + otPay + midnightPay + holidayLegalPay + actualCommute);

  // 社会保険
  let kenpo = 0, kosei = 0, shienkin = 0;
  if (emp.shakai === '加入') {
    const s = calcShakai(grossTotal, emp.birthDate, emp.hyojunHoshu || 0); // 交通費込みで標準報酬算出
    kenpo = s.kenpo; kosei = s.kosei; shienkin = s.shienkin;
  }

  // 雇用保険
  let koyoHoken = 0;
  if (emp.koyo === '加入') koyoHoken = Math.round(grossTotal * KOYO_RATE);

  // 所得税
  const taxable   = grossTotal - actualCommute - kenpo - kosei - shienkin - koyoHoken;
  const incomeTax = calcIncomeTax(taxable, emp.dependents, emp.tax);

  const juminzei       = emp.juminzei || 0;
  const chutaikyoAmount = (emp.chutaikyo === '加入') ? (emp.chutaikyoAmount || 0) : 0;
  const totalDeduction = kenpo + kosei + shienkin + koyoHoken + incomeTax + juminzei + chutaikyoAmount;
  const netPay         = Math.round(grossTotal - totalDeduction);

  return {
    basePay:             Math.round(basePay),
    skillPay, skillPayNote,
    positionAllowancePay,
    otPay:               Math.round(otPay),
    midnightPay:         Math.round(midnightPay),
    midnightOnlyPay:     Math.round(midnightOnlyPay),
    midnightOTPay:       Math.round(midnightOTPay),
    holidayLegalPay:     Math.round(holidayLegalPay),
    holidayNonLegalPay:  0,
    holidayPay:          Math.round(holidayLegalPay),
    commute:    actualCommute,
    commuteNote: emp.commuteType === 'daily' ? `${(emp.commutePerDay||0).toLocaleString()}円×${workDays}日` : '月額固定',
    kaigo: isKaigoTarget(emp.birthDate),
    grossTotal, kenpo, kosei, shienkin, koyoHoken, incomeTax, juminzei, chutaikyoAmount,
    totalDeduction:      Math.round(totalDeduction),
    netPay,
    monthOT, monthDailyOT, monthWeekOT,
    monthMidnight, monthMidnightOT,
    monthHolidayLegal, monthHolidayNonLegal,
    monthHoliday: monthHolidayLegal + monthHolidayNonLegal,
    totalActual, workDays, paidDays, absentDays,
    hourlyBase:  Math.round(h),
    ot60under, ot60over,
  };
}

// 給与計算期間内の所定労働日数（前月21日〜当月20日、土日除く簡易版）
function getMonthWorkingDays(year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  const start = new Date(startDate);
  const end   = new Date(endDate);
  let count = 0;
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const dow = dt.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

// 有給付与計算（労基法 39条準拠）
function calcPaidLeaveGrant(hireDateStr) {
  if (!hireDateStr) return [];
  const hire = new Date(hireDateStr);
  const grants = [];
  // 継続勤務年数別付与日数
  const grantTable = [
    { months:6, days:10 }, { months:18, days:11 }, { months:30, days:12 },
    { months:42, days:14 }, { months:54, days:16 }, { months:66, days:18 },
    { months:78, days:20 },
  ];
  const today = new Date();
  for (const g of grantTable) {
    const grantDate = new Date(hire);
    grantDate.setMonth(grantDate.getMonth() + g.months);
    if (grantDate <= today) {
      grants.push({ date: grantDate.toISOString().slice(0,10), days: g.days, months: g.months });
    }
  }
  return grants;
}

// 有給残日数取得
function getPaidLeaveBalance(empId) {
  const pl = paidLeave[empId];
  if (!pl) return { balance: 0, grants: [], used: [] };
  const totalGrant = (pl.grants || []).reduce((s,g)=>s+g.days,0);
  const totalUsed  = (pl.used  || []).reduce((s,u)=>s+u.days,0);
  return { balance: totalGrant - totalUsed, grants: pl.grants||[], used: pl.used||[] };
}

// ３６協定チェック（月80h / 年720h）
function check36(empId, year, month) {
  const ym = getYM(year, month);
  // 当月残業
  const summary = getMonthSummary(empId, year, month);
  const monthlyOT = summary.monthOT;

  // 年間集計
  let yearlyOT = 0;
  for (let m = 1; m <= 12; m++) {
    const s = getMonthSummary(empId, year, m);
    yearlyOT += s.monthOT;
  }

  const a36 = article36[year] || { limit36: 45, specialLimit: 80, yearLimit: 720 };

  const alerts = [];
  if (monthlyOT > a36.specialLimit) alerts.push({ level:'danger', msg:`月残業${monthlyOT.toFixed(1)}h → 特別条項上限${a36.specialLimit}h 超過` });
  else if (monthlyOT > a36.limit36) alerts.push({ level:'warn', msg:`月残業${monthlyOT.toFixed(1)}h → 一般条項上限${a36.limit36}h 超 ／ 特別条項を適用` });
  if (yearlyOT > a36.yearLimit) alerts.push({ level:'danger', msg:`年間残業${yearlyOT.toFixed(1)}h → 年間上限${a36.yearLimit}h 超過` });

  return { monthlyOT, yearlyOT, alerts };
}
