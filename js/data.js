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
  { id:1,  name:'青木 優介',      kana:'アオキ ユウスケ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:2,  name:'原 孝志',        kana:'ハラ タカシ',       type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:3,  name:'小沼 太一',      kana:'オヌマ タイチ',     type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
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
  { id:19, name:'檜山 明子',      kana:'ヒヤマ アキコ',     type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:20, name:'直井',           kana:'ナオイ',            type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:21, name:'黒羽',           kana:'クロハ',            type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  // 追加
  { id:22, name:'圷 竜司',        kana:'アクツ リュウジ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, fixedOTHours:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
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

// 雇用保険料の端数処理（源泉控除の原則）
// 50銭以下 → 切り捨て、50銭1厘以上 → 切り上げ
// ※四捨五入と異なり、端数がちょうど50銭のときは切り捨てる
function calcKoyoHoken(amount) {
  const rin = Math.round(amount * KOYO_RATE * 1000); // 厘（0.001円）単位に丸めてFP誤差を除去
  const yen = Math.floor(rin / 1000);
  return (rin - yen * 1000 <= 500) ? yen : yen + 1;
}
// 【R8.7.14】距離計算方式の交通費単価（円/km・往復それぞれに適用）と会社住所
const COMMUTE_YEN_PER_KM = 10;
const COMPANY_ADDRESS = '茨城県東茨城郡大洗町港中央9-4';

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
  targetGrossHistory: () => db.ref('payroll/targetGrossHistory'),
};

// -------- State --------
let employees  = [];
let attendance = {};
let paidLeave  = {};
let article36  = {};
let salaryAdj  = {}; // 給与調整値 { ym: { empId: { field: value } } }
let targetGrossHistory = {}; // 月別目標総支給 { empId: { '2026-07': 400000, ... } }
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
  const fields = ['basePay','skillPay','otPay','midnightPay',
    'holidayLegalPay','commute','kenpo','kosei','shienkin','koyoHoken',
    'incomeTax','juminzei','chutaikyoAmount'];
  sal.positionAllowancePay = 0; // 役職手当廃止（調整データが残っていても無視）
  for (const f of fields) {
    if (adj[f] !== undefined) sal[f] = adj[f];
  }

  // 支給合計・控除合計・振込額を再計算
  // 【修正 R8.7.14】中退共掛金は全額事業主負担のため控除合計に算入しない
  sal.grossTotal    = sal.basePay + sal.skillPay + sal.positionAllowancePay
    + sal.otPay + sal.midnightPay + sal.holidayLegalPay + sal.commute;
  sal.totalDeduction = sal.kenpo + sal.kosei + sal.shienkin + sal.koyoHoken
    + sal.incomeTax + sal.juminzei;
  sal.netPay = Math.round(sal.grossTotal - sal.totalDeduction);
  return sal;
}

// salaryAdj の Firebase 購読（月が変わった時に呼ぶ）
let _adjUnsub = null;
let _adjSubYm = null; // 購読中の年月（再購読ループ防止）
function subscribeAdj(year, month) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  // 同じ月を既に購読中なら何もしない
  // （renderPayslip等がページ再描画のたびに呼んでも、購読の張り直し→
  //   Firebaseの即時value発火→再描画→再購読…の無限ループにならない）
  if (_adjSubYm === ym && _adjUnsub) return;
  if (_adjUnsub) _adjUnsub();
  _adjSubYm = ym;
  const ref = FB.salaryAdj(ym);
  const handler = snap => {
    const val = snap.val() || {};
    // 値が変わった時だけ再描画（初回購読の即時発火で中身が同じなら再描画しない）
    const changed = JSON.stringify(salaryAdj[ym] || {}) !== JSON.stringify(val);
    salaryAdj[ym] = val;
    if (changed && _fbLoaded && ['salary','payslip','dashboard'].includes(currentPage)) refreshCurrentPageData();
  };
  ref.on('value', handler);
  _adjUnsub = () => { ref.off('value', handler); _adjSubYm = null; };
}

// 在籍中スタッフのみ
function activeEmployees() {
  return employees.filter(e => e.status !== 'inactive' && e.status !== 'leave');
}

// -------- 両店スタッフ対応ヘルパー --------
function isBothStoreId(empId) {
  return String(empId).includes('_enya') || String(empId).includes('_marco');
}
function getBaseId(empId) {
  return parseInt(String(empId).replace('_enya','').replace('_marco',''));
}
// 両店スタッフを本店・マルコの2行に展開した一覧を返す（勤怠入力・週次・月次など店舗別ページ専用）
function activeEmployeesExpanded() {
  const list = [];
  for (const e of activeEmployees()) {
    if (e.store === '両店') {
      list.push({ ...e, id: `${e.id}_enya`,  name: `${e.name}【本店】`,  _origId: e.id });
      list.push({ ...e, id: `${e.id}_marco`, name: `${e.name}【マルコ】`, _origId: e.id });
    } else {
      list.push(e);
    }
  }
  return list;
}

// 給与計算用：両店スタッフは _enya+_marco を合算して1つの給与オブジェクトを返す
// 通常スタッフは calcSalary をそのまま呼ぶ
function calcSalaryBoth(emp, year, month) {
  if (emp.store !== '両店') return calcSalary(emp, year, month);
  const empE = { ...emp, id: `${emp.id}_enya`,  name: `${emp.name}【本店】` };
  const empM = { ...emp, id: `${emp.id}_marco`, name: `${emp.name}【マルコ】` };
  const salE = calcSalary(empE, year, month);
  const salM = calcSalary(empM, year, month);
  // 【修正 R8.7.12】_enya側は両店マージ済みの勤怠で基本給・残業・控除まで
  // 全額計算済み＝会社としての正しい総支給。従来はここに salM.basePay /
  // salM.grossTotal / salM.workDays を加算していたため、マルコ分の時間・日数が
  // 二重計上になっていた（基本給・総支給・振込額が過大）。_marco側の値は
  // 店舗別コストの内訳表示用の参考値としてのみ保持する。
  return {
    ...salE,
    _marcoActual:  salM.totalActual, // マルコ側実働（明細の内訳表示用）
    _marcoBasePay: salM.basePay,     // マルコ側人件費（店舗別コスト参考値）
  };
}

function calcSalaryWithAdjBoth(emp, year, month) {
  if (emp.store !== '両店') return calcSalaryWithAdj(emp, year, month);
  const empE = { ...emp, id: `${emp.id}_enya`,  name: `${emp.name}【本店】` };
  const empM = { ...emp, id: `${emp.id}_marco`, name: `${emp.name}【マルコ】` };
  const salE = calcSalaryWithAdj(empE, year, month);
  const salM = calcSalaryWithAdj(empM, year, month);
  // 【修正 R8.7.12】calcSalaryBothと同様、_enya側が両店合算済みのためsalMは加算しない。
  // 調整値は _enya側のID（例: 10_enya）に対して入力すれば合算後の明細に反映される。
  return {
    ...salE,
    _marcoActual:  salM.totalActual,
    _marcoBasePay: salM.basePay,
  };
}

// -------- Firebase 読み込み・リアルタイム購読 --------

// Firebase更新時にページ全体を再描画せず必要部分だけ更新する
let _salaryRefreshTimer = null;
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
    case 'payslip':
    case 'paid_leave':
    case 'article36':
    case 'labor_report':
    case 'freelance':
      renderPage(currentPage);
      break;
    case 'salary':
      // デバウンス300ms：連続発火を間引いてボタン操作を妨げない
      clearTimeout(_salaryRefreshTimer);
      _salaryRefreshTimer = setTimeout(() => {
        if (typeof refreshSalaryTable === 'function') {
          const y = parseInt(document.getElementById('targetYear')?.value);
          const m = parseInt(document.getElementById('targetMonth')?.value);
          if (!isNaN(y) && !isNaN(m)) refreshSalaryTable(y, m);
          else renderPage(currentPage);
        } else {
          renderPage(currentPage);
        }
      }, 300);
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
      // まずidでソートしてorderを付与（orderがない場合のみ）
      employees.sort((a, b) => a.id - b.id);
      employees.forEach((e, i) => { if (e.order === undefined) e.order = i * 10; });
      // orderでソート
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
    if (!_fbLoaded) onLoad(); else if (currentPage === 'attendance' || currentPage === 'weekly' || currentPage === 'monthly' || currentPage === 'freelance') refreshCurrentPageData();
  });

  FB.paidLeave().on('value', snap => {
    paidLeave = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'paid_leave') refreshCurrentPageData();
  });

  FB.article36().on('value', snap => {
    article36 = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'article36') refreshCurrentPageData();
  });
  FB.targetGrossHistory().on('value', snap => {
    targetGrossHistory = snap.val() || {};
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
// 週40h超残業を「日」に帰属させる（労基法準拠）
// 日次残業(8h超)と法定休日(木曜)労働を除いた実働を時系列に累積し、
// 累計40h(2400分)を超えた分をその日の週次残業として帰属する。
// ※法定外休日(水曜)の労働は週40hの算定に含める（超過分が25%対象になるため）
// 月マタギ週でも「40hを超えた日が属する給与月」に全額計上される。
// 戻り値: { 'YYYY-MM-DD': 分, ... }
function attributeWeeklyOT(days) {
  const sorted = [...days].sort((a, b) => (a.date < b.date ? -1 : 1));
  let cumMins = 0;
  const otByDate = {};
  for (const d of sorted) {
    const actualM   = Math.round((d.actual       || 0) * 60);
    const dailyOTM  = Math.round((d.dailyOT      || 0) * 60);
    const holLegalM = Math.round((d.holidayLegal || 0) * 60); // 法定休日労働は35%側で別計上
    const regM = Math.max(0, actualM - dailyOTM - holLegalM); // 週40h判定の対象時間
    const before = cumMins;
    cumMins += regM;
    const over = Math.max(0, cumMins - 2400) - Math.max(0, before - 2400);
    if (over > 0) otByDate[d.date] = over;
  }
  return otByDate;
}

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

    const { startDate, endDate } = getPayPeriod(year, month);

    // （週全体の40h判定は attributeWeeklyOT 内で日別に累積計算する）

    // 当月期間内の日だけ（深夜・休日・表示用実働は当月分のみ）
    let wkActualMins=0, wkDailyOTMins=0, wkMidnightMins=0, wkMidnightOTMins=0;
    let wkHolidayLegalMins=0, wkHolidayNonLegalMins=0;

    for (const d of wkData.days) {
      if (d.date < startDate || d.date > endDate) continue;
      wkActualMins          += Math.round((d.actual       ||0) * 60);
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

    // 週40h超残業：週全日の合計で判定（法的に正しい）
    // 週40h超残業：週全日を通しで「日」に帰属させ、当月給与期間内の日の分のみ計上する。
    // 【旧方式のバグ】期末マタギは全額翌月送り／期首マタギは実働比按分という非対称な
    // 設計だったため、翌月側では按分分しか受け取れず差額が計上漏れになっていた。
    // 日別帰属方式なら「累計40hを超えた日が属する給与月」に全額計上され、月をまたいでも
    // 合計が必ず週の法定残業と一致する。
    const otByDate = attributeWeeklyOT(wkData.days);
    let wkWeekOTMins = 0;
    for (const dDate in otByDate) {
      if (dDate >= startDate && dDate <= endDate) wkWeekOTMins += otByDate[dDate];
    }
    const wkOT = wkDailyOT + wkWeekOTMins / 60;
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
      dailyOT:wkDailyOT, weekOT:wkWeekOTMins/60, overtime:wkOT,
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
// 両店マージ済みレコード（_merged:true）はactualが既に合算済みなのでスキップ
function recomputeRec(rec) {
  if (rec._merged) return rec; // マージ済みは再計算しない
  // 打刻キー正規化（timecard は 'in'/'out'、手動入力は 'punchIn'/'punchOut'）
  if (!rec.punchIn  && rec.in)  rec = { ...rec, punchIn:  rec.in  };
  if (!rec.punchOut && rec.out) rec = { ...rec, punchOut: rec.out };
  // ゼロパディング：'7:48' → '07:48'（input[type=time]はHH:mm形式が必要）
  const _padT = t => t && /^\d:\d\d$/.test(t) ? '0'+t : t;
  rec = { ...rec, punchIn: _padT(rec.punchIn), punchOut: _padT(rec.punchOut) };
  if (!rec.punchIn || !rec.punchOut) return rec;
  // punchIn === punchOut（00:00/00:00など）は無効データとして返す
  if (rec.punchIn === rec.punchOut) return { ...rec, actual: 0, midnight: 0, dailyOT: 0, midnightOT: 0 };
  const toMins = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };

  // actual を punchIn/punchOut/breaks から再計算（休憩変更を反映）
  const inMins  = toMins(rec.punchIn);
  let   outMins = toMins(rec.punchOut);
  if (outMins <= inMins) outMins += 24 * 60; // 日またぎ
  const breakMins = (rec.breaks || []).reduce((s, b) => s + (b.minutes || 0), 0);
  const netMins   = Math.max(0, outMins - inMins - breakMins);
  const actual    = Math.round(netMins) / 60;

  // 深夜・残業を再計算
  const rawOut = toMins(rec.punchOut);
  let midnightMins = 0;
  if (rawOut >= 22*60) midnightMins = rawOut - 22*60;
  else if (rawOut < 5*60) midnightMins = rawOut + 2*60;
  const midnight    = Math.round(midnightMins) / 60;
  const dailyOTMins = Math.max(0, netMins - 480);
  const dailyOT     = dailyOTMins / 60;
  const midnightOT  = Math.min(midnight, dailyOT);
  return { ...rec, actual, midnight, dailyOT, midnightOT };
}

function getExtendedDailyList(empId, year, month, noMerge) {
  const list = [];
  const { startDate, endDate } = getPayPeriod(year, month);

  // 週マタギのため、給与期間の前後1週間（7日）だけを取得範囲とする
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const rangeStart = new Date(start); rangeStart.setDate(rangeStart.getDate() - 6);
  const rangeEnd   = new Date(end);   rangeEnd.setDate(rangeEnd.getDate() + 6);

  // スキャン対象月を絞る（前月・当月・翌月の3ヶ月だけ）
  const prev = month === 1 ? [year-1, 12] : [year, month-1];
  const next = month === 12 ? [year+1, 1] : [year, month+1];
  const monthsToScan = [prev, [year, month], next];

  // 両店スタッフ判定：empIdが '_enya' or '_marco' 形式か
  // noMerge=true の場合（勤怠入力ページなど店舗ごとに完全に独立させたい画面）は
  // 旧キー互換読み込み・パートナー店舗マージを行わず、自分のキーのデータのみ返す
  const bothStore = isBothStoreId(empId) && !noMerge;
  const baseId    = bothStore ? getBaseId(empId) : null;
  // 両店の場合、もう片方のキーを求める
  const partnerKey = bothStore
    ? (String(empId).includes('_enya') ? `${baseId}_marco` : `${baseId}_enya`)
    : null;

  for (const [y,m] of monthsToScan) {
    const ym = getYM(y,m);

    // 【旧キー互換】両店スタッフの場合、数値IDのデータも読む（店舗選択導入前のデータ）
    // _enya/_marco どちらから見ても旧データは表示する
    if (bothStore) {
      const oldData = (attendance[ym] && (attendance[ym][baseId] || attendance[ym][String(baseId)])) || {};
      for (const [date, rec] of Object.entries(oldData)) {
        const d = new Date(date);
        if (d < rangeStart || d > rangeEnd) continue;
        const existing = list.findIndex(r=>r.date===date);
        if (existing === -1) {
          list.push({ date, ...recomputeRec(rec), _legacy: true });
        } else if (rec.source === 'manual') {
          list[existing] = { date, ...recomputeRec(rec), _legacy: true };
        }
      }
    }

    const empData = (attendance[ym] && attendance[ym][empId]) || {};
    for (const [date, rec] of Object.entries(empData)) {
      const d = new Date(date);
      if (d < rangeStart || d > rangeEnd) continue;

      const existing = list.findIndex(r=>r.date===date);
      if (existing === -1) {
        list.push({ date, ...recomputeRec(rec) });
      } else if (rec.source === 'manual') {
        list[existing] = { date, ...recomputeRec(rec) };
      } else if ((rec.source === 'csv' || rec.source === 'timecard') && list[existing].source !== 'manual') {
        list[existing] = { date, ...recomputeRec(rec) };
      }
    }

    // 両店スタッフ：パートナー（もう片方の店）の同日データをマージ
    if (bothStore && partnerKey) {
      const partnerData = (attendance[ym] && attendance[ym][partnerKey]) || {};
      for (const [date, partnerRec] of Object.entries(partnerData)) {
        const d = new Date(date);
        if (d < rangeStart || d > rangeEnd) continue;

        const existing = list.findIndex(r=>r.date===date);
        const pRec = recomputeRec(partnerRec);

        if (existing === -1) {
          list.push({ date, ...pRec });
        } else if (list[existing]._legacy) {
          // 旧データしかない日に新キーのデータが来たら新キーで上書き
          list[existing] = { date, ...pRec };
        } else {
          // 同日に両店の新キーデータがある → 合算
          const myRec = list[existing];
          const mergedActualMins = Math.round((myRec.actual||0)*60) + Math.round((pRec.actual||0)*60);
          const mergedMidnightMins = Math.round((myRec.midnight||0)*60) + Math.round((pRec.midnight||0)*60);
          const mergedDailyOTMins = Math.max(0, mergedActualMins - 480);
          const mergedMidnightOT = Math.min(mergedMidnightMins/60, mergedDailyOTMins/60);
          list[existing] = {
            date,
            actual:     mergedActualMins / 60,
            dailyOT:    mergedDailyOTMins / 60,
            midnight:   mergedMidnightMins / 60,
            midnightOT: mergedMidnightOT,
            breaks: [...(myRec.breaks||[]), ...(pRec.breaks||[])],
            breakMins: (myRec.breakMins||0) + (pRec.breakMins||0),
            punchIn:  myRec.punchIn  || pRec.punchIn,
            punchOut: myRec.punchOut || pRec.punchOut,
            source: myRec.source === 'manual' || pRec.source === 'manual' ? 'manual' : 'timecard',
            _merged: true,
          };
        }
      }
    }
  }
  return list.sort((a,b)=>a.date.localeCompare(b.date));
}

// 月次サマリ取得（週マタギ計算込み・給与計算期間基準）
function getMonthSummary(empId, year, month, noMerge) {
  const extended = getExtendedDailyList(empId, year, month, noMerge);
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
    if (d.paidLeave) paidDays++; // 勤怠入力のチェック（後方互換）
    if (d.absent) absentDays++;
    if (d.late > 0) lateDays++;
  }

  // 有給管理簿の取得記録を優先してpaidDaysを上書き
  // paidLeave[empId].used の日付が給与期間内にあればカウント
  const baseEmpId = isBothStoreId(empId) ? getBaseId(empId) : empId;
  const plRecord = paidLeave[baseEmpId] || paidLeave[String(baseEmpId)] || {};
  const usedInPeriod = (plRecord.used || []).filter(u => u.date >= startDate && u.date <= endDate);
  if (usedInPeriod.length > 0) {
    paidDays = usedInPeriod.reduce((s, u) => s + (u.days || 1), 0);
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

  // 月別targetGrossHistory を参照（マスタのtargetGrossより優先）
  const _ym = `${year}-${String(month).padStart(2,'0')}`;
  const _monthlyTG = (targetGrossHistory[String(emp.id)] || {})[_ym];
  if (_monthlyTG !== undefined) {
    emp = Object.assign({}, emp, { targetGross: _monthlyTG, fixedOTHours: 0 });
  }

  // fixedOTHours は targetGross を変えない（手動設定優先）
  // 残業代の下限保証として使用：実績残業代 < 固定残業代 の場合は固定残業代を保証
  // ※ 実際の下限保証はotPay計算後に適用（下記参照）

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

  // ── 両店スタッフの場合の特別処理 ──────────────────────
  // _enya側：両店合算のactual・残業を使い、残業代も全額計上する
  // _marco側：その店での実労働時間分の基本給のみ。残業代はゼロ（_enya側で計上済み）
  const isMarcoSide = String(emp.id).includes('_marco');
  const isEnyaSide  = String(emp.id).includes('_enya');

  // _marco側の「純粋な本人の労働時間」（合算前）を取得する
  // getExtendedDailyListはマージ済みのactualを返すので、
  // _marco自身のFirebaseデータから実際の労働時間を直接合算する
  let marcoOnlyActual = 0;
  let marcoOnlyWorkDays = 0;
  if (isMarcoSide) {
    const baseId = getBaseId(emp.id);
    const prev = month === 1 ? [year-1, 12] : [year, month-1];
    const next = month === 12 ? [year+1, 1] : [year, month+1];
    const { startDate, endDate } = getPayPeriod(year, month);
    for (const [y,m] of [prev, [year, month], next]) {
      const ym = getYM(y,m);
      // _marco新キーのデータのみ集計（旧キー＝数値IDのデータは本店側に計上するため除外）
      const marcoData = (attendance[ym] && attendance[ym][emp.id]) || {};
      for (const [date, rec] of Object.entries(marcoData)) {
        if (date < startDate || date > endDate) continue;
        const r = recomputeRec(rec);
        marcoOnlyActual += r.actual || 0;
        if (r.actual > 0) marcoOnlyWorkDays++;
      }
    }
  }

  let basePay = 0, hourlyBase = 0, baseHours = 0;

  if (emp.payType === '月給') {
    const MONTHLY_HOURS = emp.monthlyHours || 173.8;
    // 残業計算用時給：hourlyWageが設定されていればそれを優先、なければbaseSalary÷月平均時間
    hourlyBase = emp.hourlyWage > 0 ? emp.hourlyWage : emp.baseSalary / MONTHLY_HOURS;
    basePay = emp.baseSalary - absentDays * 8 * hourlyBase;
  } else {
    hourlyBase = emp.hourlyWage;
    if (isMarcoSide) {
      // _marco側：マルコでの実労働時間分のみ基本給計上（残業は_enya側で全額計上）
      baseHours = marcoOnlyActual;
      basePay = baseHours * hourlyBase;
    } else {
      // 通常 or _enya側：基本給＝所定内時間（実働−法定残業）×時給
      // 【修正 R8.7.12】従来は実働全時間×時給を基本給とし、さらに残業手当で
      // 125%/150%を全額支給していたため、残業時間に225%を支払う二重計上だった。
      // 残業時間分の100%＋割増は残業手当側で全額支給するため、基本給から除外する。
      // ※法定休日（木曜）の時間はmonthOTに含まれない＝100%分は基本給に残り、
      //   +35%を法定休日手当で別途支給（合計135%）。深夜は+25%を深夜手当で加算。
      baseHours = Math.max(0, totalActual - monthOT);
      basePay = baseHours * hourlyBase;
    }
  }

  const h = hourlyBase;

  // 役職手当
  const positionAllowancePay = emp.positionAllowance || 0;

  // ── 通勤手当 ──────────────────────────────────────────
  // 【追加 R8.7.14】距離計算方式（commuteType='distance'）
  //   支給額 = 片道km × 2（往復） × 10円/km × 出勤日数
  //   住所に「大洗町」を含むスタッフは原則不支給（例外は給与調整で個別対応）
  //   ※片道2km未満は税法上全額課税だが、大洗町ルールにより実質発生しない想定。
  //     2km以上の実費相当額（10円/km）は非課税限度額の範囲内。
  const baseWorkDays = isMarcoSide ? marcoOnlyWorkDays : workDays;
  let actualCommute, commuteNoteText;
  if (emp.commuteType === 'distance') {
    const isOaraiResident = String(emp.address || '').includes('大洗町');
    const km = emp.commuteKm || 0;
    if (isMarcoSide) {
      actualCommute = 0; commuteNoteText = '（本店側で計上）';
    } else if (isOaraiResident) {
      actualCommute = 0; commuteNoteText = '大洗町在住のため不支給';
    } else {
      actualCommute = Math.round(km * 2 * COMMUTE_YEN_PER_KM * baseWorkDays);
      commuteNoteText = `${km}km×往復×${COMMUTE_YEN_PER_KM}円×${baseWorkDays}日`;
    }
  } else if (emp.commuteType === 'daily') {
    actualCommute = (emp.commutePerDay || 0) * baseWorkDays;
    commuteNoteText = `${(emp.commutePerDay||0).toLocaleString()}円×${baseWorkDays}日`;
  } else {
    actualCommute = isMarcoSide ? 0 : (emp.commute || 0); // _marco側は通勤手当なし（_enya側で計上）
    commuteNoteText = isMarcoSide ? '（本店側で計上）' : '月額固定';
  }

  // 残業手当（_marco側はゼロ：_enya側で両店合算済み残業代を全額計上）
  const effectiveMonthOT      = isMarcoSide ? 0 : monthOT;
  const effectiveMonthMidnight   = isMarcoSide ? 0 : monthMidnight;
  const effectiveMonthMidnightOT = isMarcoSide ? 0 : monthMidnightOT;
  const effectiveHolidayLegal    = isMarcoSide ? 0 : monthHolidayLegal;

  const ot60under = Math.min(effectiveMonthOT, 60);
  const ot60over  = Math.max(0, effectiveMonthOT - 60);
  let otPay       = ot60under * h * 1.25 + ot60over * h * 1.50;

  // 固定残業代の下限保証：実績残業代 < 固定残業代 の場合は固定残業代を支給
  // （実績が上回った場合は実績通り追加支給）
  if (emp.payType === '月給' && (emp.fixedOTHours || 0) > 0 && !isMarcoSide) {
    const fixedOTPay = Math.round(emp.fixedOTHours * h * 1.25);
    if (otPay < fixedOTPay) otPay = fixedOTPay;
  }

  // 残業内訳（明細表示用）
  // 日8h超・週40h超を60h枠に按分して計算
  const effectiveDailyOT = isMarcoSide ? 0 : monthDailyOT;
  const effectiveWeekOT  = isMarcoSide ? 0 : monthWeekOT;
  const dailyOT60under = Math.min(effectiveDailyOT, ot60under);
  const weekOT60under  = Math.min(effectiveWeekOT, Math.max(0, ot60under - dailyOT60under));
  const dailyOTPay  = Math.round(dailyOT60under * h * 1.25);
  const weekOTPay   = Math.round(weekOT60under  * h * 1.25);
  const ot60overPay = Math.round(ot60over * h * 1.50);

  const midnightOnly    = effectiveMonthMidnight - effectiveMonthMidnightOT;
  const midnightOnlyPay = midnightOnly * h * 0.25;
  const midnightOT60u   = Math.min(effectiveMonthMidnightOT, 60);
  const midnightOT60o   = Math.max(0, effectiveMonthMidnightOT - 60);
  const midnightOTPay   = midnightOT60u * h * 0.25 + midnightOT60o * h * 0.25;
  const midnightPay     = midnightOnlyPay + midnightOTPay;

  const holidayLegalPay = effectiveHolidayLegal * h * 0.35;

  // ── 交通費（調整給）の計算 ─────────────────────────────
  // 役職手当廃止。月給スタッフかつ targetGross 設定あり:
  //   交通費 = targetGross - 基本給 - 残業代等
  //   残業代が targetGross を超えた場合は交通費=0（追払い発生）
  const skillPay = 0; // 職能給廃止
  const positionAllowanceAdj = 0; // 役職手当廃止

  // 【修正 R8.7.20】丸めの流儀を「各行を丸めてから合計」に全経路で統一。
  // 従来は素の計算＝実数合計後に丸め／調整適用後＝丸めた各行の合計、と流儀が
  // 混在しており、端数の重なりで支給合計が目標総支給から1円ずれることがあった。
  const otPayR       = Math.round(otPay);
  const midnightPayR = Math.round(midnightPay);
  const holidayPayR  = Math.round(holidayLegalPay);
  const basePayR     = Math.round(basePay);

  let commuteAdj = actualCommute;
  if (emp.payType === '月給' && emp.targetGross > 0 && !isMarcoSide) {
    const otTotal = otPayR + midnightPayR + holidayPayR;
    commuteAdj = Math.max(0, emp.targetGross - emp.baseSalary - otTotal);
    // 注釈も調整の実態に合わせる（距離式のままだと金額と説明が食い違う）
    commuteNoteText = '目標総支給（¥' + emp.targetGross.toLocaleString() + '）による調整';
  }

  let grossTotal = basePayR + positionAllowanceAdj + otPayR + midnightPayR + holidayPayR + commuteAdj;

  // 社会保険
  let kenpo = 0, kosei = 0, shienkin = 0;
  if (emp.shakai === '加入') {
    const s = calcShakai(grossTotal, emp.birthDate, emp.hyojunHoshu || 0);
    kenpo = s.kenpo; kosei = s.kosei; shienkin = s.shienkin;
  }

  // 雇用保険
  let koyoHoken = 0;
  if (emp.koyo === '加入') koyoHoken = calcKoyoHoken(grossTotal);

  // 所得税
  // ※業務委託は原則、給与の源泉徴収税額表の対象外（所得税0）
  // 【追加 R8.7.19】業務委託でも所得税区分が「乙」のスタッフは乙欄で自動源泉し、
  //   同額を交通費欄に補填として自動計上する（手取り＝時給×実働を維持する運用）。
  //   月額課税支給88,000円未満の乙欄税額＝課税支給額×3.063%（1円未満切捨て）。
  //   ※88,000円以上は月額表乙欄の階段税額への置き換えが必要（要税理士確認）。
  const taxable = grossTotal - commuteAdj - kenpo - kosei - shienkin - koyoHoken;
  let incomeTax;
  if (emp.type === '業務委託') {
    if (emp.tax === '乙') {
      incomeTax = Math.floor(Math.max(0, taxable) * 0.03063);
      if (incomeTax > 0) {
        commuteAdj += incomeTax;                       // 源泉税相当を交通費で補填
        grossTotal = Math.round(grossTotal + incomeTax);
        commuteNoteText = (actualCommute > 0 ? commuteNoteText + '＋' : '') + '源泉税相当補填 ¥' + incomeTax.toLocaleString();
      }
    } else {
      incomeTax = 0;
    }
  } else {
    incomeTax = calcIncomeTax(taxable, emp.dependents, emp.tax);
  }

  const juminzei        = emp.juminzei || 0;
  // 【修正 R8.7.14】中退共掛金は中小企業退職金共済法により全額事業主負担。
  // 賃金からの控除は本人同意があっても不可（労基法24条 全額払い原則にも抵触）。
  // 従来は控除合計に算入していた＝違法控除。金額は参考情報として保持するが控除しない。
  const chutaikyoAmount = (emp.chutaikyo === '加入') ? (emp.chutaikyoAmount || 0) : 0;
  const totalDeduction  = kenpo + kosei + shienkin + koyoHoken + incomeTax + juminzei;
  const netPay          = Math.round(grossTotal - totalDeduction);

  return {
    basePay:             basePayR,
    baseHours,           // 時給者の基本給対象時間（h）明細の内訳表示用。月給者は0
    skillPay, skillPayNote: '',
    positionAllowancePay: positionAllowanceAdj,
    otPay:               otPayR,
    midnightPay:         midnightPayR,
    midnightOnlyPay:     Math.round(midnightOnlyPay),
    midnightOTPay:       Math.round(midnightOTPay),
    holidayLegalPay:     holidayPayR,
    holidayNonLegalPay:  0,
    holidayPay:          holidayPayR,
    commute:    commuteAdj,
    commuteNote: commuteNoteText,
    kaigo: isKaigoTarget(emp.birthDate),
    grossTotal, kenpo, kosei, shienkin, koyoHoken, incomeTax, juminzei, chutaikyoAmount,
    totalDeduction:      Math.round(totalDeduction),
    netPay,
    monthOT:        effectiveMonthOT,
    monthDailyOT:   isMarcoSide ? 0 : monthDailyOT,
    monthWeekOT:    isMarcoSide ? 0 : monthWeekOT,
    monthMidnight:  effectiveMonthMidnight,
    monthMidnightOT: effectiveMonthMidnightOT,
    monthHolidayLegal:    effectiveHolidayLegal,
    monthHolidayNonLegal: isMarcoSide ? 0 : monthHolidayNonLegal,
    monthHoliday:   isMarcoSide ? 0 : (monthHolidayLegal + monthHolidayNonLegal),
    totalActual: isMarcoSide ? marcoOnlyActual : totalActual,
    workDays: baseWorkDays,
    paidDays, absentDays,
    hourlyBase:  Math.round(h),
    ot60under, ot60over,
    dailyOTPay, weekOTPay, ot60overPay,
    _bothStoreSide: isEnyaSide ? 'enya' : isMarcoSide ? 'marco' : null,
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

// ============================================================
// 賞与（インセンティブ）計算
// ============================================================

// 賞与に対する源泉徴収税額の算出率の表（令和8年度）
// [前月社保控除後給与の下限, 上限, 扶養0人率, 1人率, 2人率, 3人率, 4人率, 5人率, 6人率, 乙欄率]
const BONUS_TAX_TABLE = [
  [0,      68000,  0,      0,      0,      0,      0,      0,      0,      0.03063],
  [68000,  79000,  2.042,  0,      0,      0,      0,      0,      0,      0.04084],
  [79000,  252000, 10.21,  2.042,  0,      0,      0,      0,      0,      0.07635],
  [252000, 300000, 10.21,  10.21,  2.042,  0,      0,      0,      0,      0.07635],
  [300000, 334000, 20.42,  10.21,  10.21,  2.042,  0,      0,      0,      0.10210],
  [334000, 363000, 20.42,  20.42,  10.21,  10.21,  2.042,  0,      0,      0.10210],
  [363000, 394000, 20.42,  20.42,  20.42,  10.21,  10.21,  2.042,  0,      0.10210],
  [394000, 425000, 20.42,  20.42,  20.42,  20.42,  10.21,  10.21,  2.042,  0.10210],
  [425000, 520000, 30.63,  20.42,  20.42,  20.42,  20.42,  10.21,  10.21,  0.15315],
  [520000, 617000, 30.63,  30.63,  20.42,  20.42,  20.42,  20.42,  10.21,  0.15315],
  [617000, 714000, 30.63,  30.63,  30.63,  20.42,  20.42,  20.42,  20.42,  0.15315],
  [714000, 834000, 40.84,  30.63,  30.63,  30.63,  20.42,  20.42,  20.42,  0.20420],
  [834000, 1000000,40.84,  40.84,  30.63,  30.63,  30.63,  20.42,  20.42,  0.20420],
  [1000000,1167000,40.84,  40.84,  40.84,  30.63,  30.63,  30.63,  20.42,  0.20420],
  [1167000,1334000,40.84,  40.84,  40.84,  40.84,  30.63,  30.63,  30.63,  0.20420],
  [1334000,1500000,50.420, 40.84,  40.84,  40.84,  40.84,  30.63,  30.63,  0.30630],
  [1500000,Infinity,50.420,50.420, 40.84,  40.84,  40.84,  40.84,  30.63,  0.30630],
];

/**
 * 賞与源泉徴収税額を計算する
 * @param {number} bonusAmount - 賞与額（社保控除前）
 * @param {number} prevMonthNetShakai - 前月の社保控除後給与（=課税支給額-通勤費）
 * @param {number} dependents - 扶養親族等の数
 * @param {string} taxType - '甲' or '乙'
 * @returns {number} 源泉徴収税額
 */
function calcBonusTax(bonusAmount, prevMonthNetShakai, dependents = 0, taxType = '甲') {
  if (bonusAmount <= 0) return 0;
  const dep = Math.min(Math.max(parseInt(dependents) || 0, 0), 6);

  let rate = 0;
  for (const row of BONUS_TAX_TABLE) {
    if (prevMonthNetShakai >= row[0] && prevMonthNetShakai < row[1]) {
      if (taxType === '乙') {
        rate = row[8];
      } else {
        rate = row[2 + dep] / 100;
      }
      break;
    }
  }

  // 前月給与が0（新入社員等）の場合は月換算法
  if (prevMonthNetShakai === 0) {
    const monthly = bonusAmount / 6;
    const annualIncome = monthly * 12;
    if (annualIncome <= 0) return 0;
    const monthlyTax = calcIncomeTax(monthly, dependents, taxType);
    return Math.round(monthlyTax * 6);
  }

  return Math.round(bonusAmount * rate);
}

/**
 * 賞与の全控除を計算して返す
 * @param {object} emp - 従業員オブジェクト
 * @param {number} bonusAmount - 賞与支給額（入力値）
 * @param {number} prevMonthGross - 前月総支給額（社保計算用）
 * @param {number} prevMonthNetShakai - 前月社保控除後給与（税率参照用）
 * @returns {object} 計算結果
 */
function calcBonusDeductions(emp, bonusAmount, prevMonthGross = 0, prevMonthNetShakai = 0) {
  if (bonusAmount <= 0) return { kenpo:0, kosei:0, shienkin:0, koyoHoken:0, incomeTax:0, totalDeduction:0, netPay:0 };

  // 社会保険（賞与標準額：千円未満切捨て）
  let kenpo = 0, kosei = 0, shienkin = 0;
  if (emp.shakai === '加入') {
    const hyojun = Math.floor(bonusAmount / 1000) * 1000;
    const s = calcShakai(hyojun, emp.birthDate, emp.hyojunHoshu || 0);
    kenpo = s.kenpo; kosei = s.kosei; shienkin = s.shienkin;
  }

  // 雇用保険
  let koyoHoken = 0;
  if (emp.koyo === '加入') koyoHoken = calcKoyoHoken(bonusAmount);

  // 賞与所得税（社保控除後の賞与額に税率を乗じる）
  const bonusAfterShakai = bonusAmount - kenpo - kosei - shienkin - koyoHoken;
  const incomeTax = calcBonusTax(bonusAfterShakai, prevMonthNetShakai, emp.dependents, emp.tax);

  const totalDeduction = kenpo + kosei + shienkin + koyoHoken + incomeTax;
  const netPay = bonusAmount - totalDeduction;

  return { kenpo, kosei, shienkin, koyoHoken, incomeTax, totalDeduction, netPay };
}

/**
 * 前月の給与データから社保控除後給与を取得する
 */
function getPrevMonthNetShakai(empId, year, month) {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear  = month === 1 ? year - 1 : year;
  try {
    // empIdはID（数値/文字列）でもempオブジェクトでも受け付ける
    const emp = (empId && typeof empId === 'object') ? empId
      : employees.find(e => String(e.id) === String(empId));
    if (!emp) return 0;
    // 【修正 R8.7.14】両店スタッフは勤怠が _enya/_marco 側にあるため合算版で計算する
    // （従来は素のIDで計算 → 勤怠ゼロ扱い → 前月手取り0円で賞与税率が狂っていた）
    const sal = (emp.store === '両店')
      ? calcSalaryWithAdjBoth(emp, prevYear, prevMonth)
      : calcSalaryWithAdj(emp, prevYear, prevMonth);
    if (!sal) return 0;
    // 社保控除後 = 課税総支給 - 社保（通勤費除いた支給額から）
    return Math.max(0, sal.grossTotal - (sal.commute||0) - (sal.kenpo||0) - (sal.kosei||0) - (sal.shienkin||0));
  } catch(e) {
    return 0;
  }
}

// ============================================================
// 月別目標総支給 API
// ============================================================
function setMonthlyTargetGross(empId, year, month, value) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  const key = String(empId);
  if (!targetGrossHistory[key]) targetGrossHistory[key] = {};
  if (value === null || value === 0) {
    delete targetGrossHistory[key][ym];
    db.ref(`payroll/targetGrossHistory/${key}/${ym}`).remove();
  } else {
    targetGrossHistory[key][ym] = value;
    db.ref(`payroll/targetGrossHistory/${key}/${ym}`).set(value);
  }
}

function getMonthlyTargetGross(empId, year, month) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  return (targetGrossHistory[String(empId)] || {})[ym];
}
