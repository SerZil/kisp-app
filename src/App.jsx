import React, { useState, useMemo, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const YEARS = [2022,2023,2024,2025,2026];
const CAD_TO_USD = 0.74;
const AREAS = ["CAD","VISUALIZATIONS","SALES SUPPORT","DEVELOPERS","DATA CREATION","MANAGEMENT","KiTS"];

const PAYMENT_TYPES = ["ARS","Crypto","Canada","Healthcare","Allowance","Cash2","Bonus","Mono"];
const PAYMENT_META = {
  ARS:        { label:"Pesos ARS",   unit:"ARS",  color:"blue",   prefix:"$"   },
  Crypto:     { label:"USDT",        unit:"USD",  color:"purple", prefix:"U$"  },
  Canada:     { label:"CAN USD",     unit:"USD",  color:"red",    prefix:"U$"  },
  Healthcare: { label:"Healthcare",  unit:"USD",  color:"pink",   prefix:"U$"  },
  Allowance:  { label:"Allowance",   unit:"USD",  color:"yellow", prefix:"U$"  },
  Cash2:      { label:"Cash 2",      unit:"USD",  color:"green",  prefix:"U$"  },
  Bonus:      { label:"Bonus",       unit:"USD",  color:"teal",   prefix:"U$"  },
  Mono:       { label:"Monotributo BA", unit:"ARS",  color:"green",  prefix:"$"   },
};

const COLOR = {
  blue:   { bg:"bg-blue-50",   border:"border-blue-200",   text:"text-blue-700",   badge:"bg-blue-100 text-blue-700"   },
  purple: { bg:"bg-purple-50", border:"border-purple-200", text:"text-purple-700", badge:"bg-purple-100 text-purple-700"},
  red:    { bg:"bg-red-50",    border:"border-red-200",    text:"text-red-700",    badge:"bg-red-100 text-red-700"     },
  pink:   { bg:"bg-pink-50",   border:"border-pink-200",   text:"text-pink-700",   badge:"bg-pink-100 text-pink-700"   },
  yellow: { bg:"bg-yellow-50", border:"border-yellow-200", text:"text-yellow-700", badge:"bg-yellow-100 text-yellow-700"},
  green:  { bg:"bg-green-50",  border:"border-green-200",  text:"text-green-700",  badge:"bg-green-100 text-green-700" },
  teal:   { bg:"bg-teal-50",   border:"border-teal-200",   text:"text-teal-700",   badge:"bg-teal-100 text-teal-700"   },
};

const RANK_COLORS = [
  "bg-gray-100 text-gray-600","bg-sky-100 text-sky-700","bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700","bg-violet-100 text-violet-700","bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700","bg-rose-100 text-rose-700","bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700","bg-pink-100 text-pink-700","bg-emerald-100 text-emerald-700",
];

const AVATAR_COLORS = ["bg-slate-600","bg-blue-600","bg-violet-600","bg-rose-600","bg-amber-600","bg-teal-600"];



const DATA_BY_AREA = {
  "CAD": {
    teams: ["AMQ","Architectural Walls","Cad & Specification","HNI & Educational","Haworth","Kimball & Global","MillerKnoll","Presentations","Steelcase","Steelcase Bis","Teknion"],
    cargos: ["Jr Designer In Training","Jr Designer Cad & Space Planner","Designer Cad & Space Planner","Sr Designer Cad & Space Planner","Team Supervisor","Team Manager","Team Director","Sr. Operation Director","Associate VP Production","Associate VP Production & Employee Branding Strategy","VP Production & Business Development","Sr VP Operations"],
  },
  "VISUALIZATIONS": {
    teams: ["Visualizations"],
    cargos: ["3D Artist","3D Artist - Networks & Communications","Senior 3d Artist","Senior 3D Artist - Team Lead","Art Director","Customer Relations Manager","Senior Project Manager","Sr. VP Production","Sr. VP Creativity & Innovation"],
  },
  "SALES SUPPORT": {
    teams: ["ABI","AFD - SA","Creative Office","Empire - SA","Franklin Interiors","ImageWorks","Perdue","SWOT","Sales Administration","Training","Waldners"],
    cargos: ["Jr. Sales Administration Specialist","Sales Administration Specialist","Sr. Sales Administration Specialist","Team Supervisor Of Sales Administration","Team Leader Of Sales Administration","Learning & Onboarding Manager","Sales Administration Manager"],
  },
  "DEVELOPERS": {
    teams: ["Developers"],
    cargos: ["Jr. Developer","Developer","Sr. Developer","Tech Lead","Engineering Manager"],
  },
  "DATA CREATION": {
    teams: ["Entity","Data Creation Management"],
    cargos: ["Jr. Data Specialist","Data Specialist","Sr. Data Specialist","Team Lead","Manager","Data Creation Analyst","Data Creation Manager"],
  },
  "MANAGEMENT": {
    teams: ["General Management BA"],
    cargos: ["General Manager BA","General Manager Canada","Sr VP Operations","Managing Director"],
  },
  "KitS": {
    teams: ["KitS Sales"],
    cargos: ["Jr. Sales Specialist","Sales Specialist","Sr. Sales Specialist","Team Lead"],
  },
  "ADMIN": {
    teams: ["Admin"],
    cargos: ["Administrative Assistant","Sr. Administrative Assistant","Office Manager"],
  },
  "ORDENANZA": {
    teams: ["Ordenanza"],
    cargos: ["Ordenanza"],
  },
  "IT": {
    teams: ["IT"],
    cargos: ["IT Support","Sr. IT Support","IT Manager"],
  },
};

const TEAMS_INIT = [
  // CAD
  "AMQ","Architectural Walls","Cad & Specification","HNI & Educational","Haworth","Kimball & Global","MillerKnoll","Presentations","Steelcase","Steelcase Bis","Teknion",
  // VISUALIZATIONS
  "Visualizations",
  // SALES SUPPORT
  "ABI","AFD - SA","Creative Office","Empire - SA","Franklin Interiors","ImageWorks","Perdue","SWOT","Sales Administration","Training","Waldners",
  // DEVELOPERS
  "Developers",
  // DATA CREATION
  "Entity","Data Creation Management",
  // MANAGEMENT
  "General Management BA",
  // KitS
  "KitS Sales",
  // ADMIN
  "Admin",
  // ORDENANZA
  "Ordenanza",
  // IT
  "IT",
];
const RANKS_INIT = [
  // CAD
  "Jr Designer In Training","Jr Designer Cad & Space Planner","Designer Cad & Space Planner","Sr Designer Cad & Space Planner","Team Supervisor","Team Manager","Team Director","Sr. Operation Director","Associate VP Production","Associate VP Production & Employee Branding Strategy","VP Production & Business Development","Sr VP Operations",
  // VISUALIZATIONS
  "3D Artist","3D Artist - Networks & Communications","Senior 3d Artist","Senior 3D Artist - Team Lead","Art Director","Customer Relations Manager","Senior Project Manager","Sr. VP Production","Sr. VP Creativity & Innovation",
  // SALES SUPPORT
  "Jr. Sales Administration Specialist","Sales Administration Specialist","Sr. Sales Administration Specialist","Team Supervisor Of Sales Administration","Team Leader Of Sales Administration","Learning & Onboarding Manager","Sales Administration Manager",
  // DEVELOPERS
  "Jr. Developer","Developer","Sr. Developer","Tech Lead","Engineering Manager",
  // DATA CREATION
  "Jr. Data Specialist","Data Specialist","Sr. Data Specialist","Data Creation Analyst","Data Creation Manager",
  // MANAGEMENT
  "General Manager BA","General Manager Canada","Managing Director",
  // KitS
  "Jr. Sales Specialist","Sales Specialist","Sr. Sales Specialist",
  // ADMIN
  "Administrative Assistant","Sr. Administrative Assistant","Office Manager",
  // ORDENANZA
  "Ordenanza",
  // IT
  "IT Support","Sr. IT Support","IT Manager",
  // SHARED
  "Team Lead","Manager","Senior Manager","Director","VP",
];

const DOLAR_BLUE = {
  // 2019 - valores compra cierre de mes
  "2019-01":40,"2019-02":40,"2019-03":42,"2019-04":44,"2019-05":44,"2019-06":45,
  "2019-07":46,"2019-08":55,"2019-09":58,"2019-10":65,"2019-11":66,"2019-12":67,
  // 2020
  "2020-01":80,"2020-02":82,"2020-03":85,"2020-04":112,"2020-05":120,"2020-06":125,
  "2020-07":130,"2020-08":134,"2020-09":148,"2020-10":162,"2020-11":152,"2020-12":152,
  // 2021
  "2021-01":148,"2021-02":152,"2021-03":142,"2021-04":143,"2021-05":165,"2021-06":173,
  "2021-07":175,"2021-08":175,"2021-09":178,"2021-10":188,"2021-11":195,"2021-12":206,
  // 2022 - fuente: cotizacion-dolar.com.ar / dolarhistorico.com (compra, cierre de mes)
  "2022-01":207,"2022-02":210,"2022-03":202,"2022-04":195,"2022-05":210,"2022-06":225,
  "2022-07":290,"2022-08":275,"2022-09":285,"2022-10":290,"2022-11":310,"2022-12":342,
  // 2023-2026 - extraídos del archivo Excel KiSP
  "2023-01":375,"2023-02":380,"2023-03":390,"2023-04":420,"2023-05":480,"2023-06":495,
  "2023-07":510,"2023-08":720,"2023-09":875,"2023-10":950,"2023-11":1075,"2023-12":990,
  "2024-01":1195,"2024-02":1030,"2024-03":1030,"2024-04":1045,"2024-05":1300,"2024-06":1345,
  "2024-07":1435,"2024-08":1285,"2024-09":1200,"2024-10":1130,"2024-11":1100,"2024-12":1210,
  "2025-01":1205,"2025-02":1235,"2025-03":1200,"2025-04":1165,"2025-05":1160,"2025-06":1195,
  "2025-07":1310,"2025-08":1335,"2025-09":1425,"2025-10":1445,"2025-11":1420,"2025-12":1520,
  "2026-01":1460,"2026-02":1400,"2026-03":1405,
};

const EMPLOYEES_INIT = [
  { id:190, name:"MARIELA RICO", team:"Cad & Specification", activeFrom:"2006-02-02", activeTo:"", area:"CAD", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"27.387.115", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 207095, "Cash2": 1000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 223191, "Canada": 1000}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 237042, "Canada": 1000}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 261081, "Canada": 1000}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 272461, "Canada": 1000}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 271341, "Canada": 1000}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 297107, "Canada": 1000}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 313457, "Canada": 1000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 329807, "Canada": 1000}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 402433, "Canada": 1000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 461808, "Canada": 1000}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 521183, "Canada": 1000}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 621893, "Canada": 1000}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 710197, "Canada": 1000}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 798501, "Canada": 1000}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 896096, "Canada": 1000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 928385, "Crypto": 1000}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 957590, "Crypto": 2500}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 983550, "Crypto": 2500}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 1017995, "Crypto": 2500}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1031740, "Crypto": 2500}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1045400, "Crypto": 2500}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1061081, "Crypto": 2500}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1071879, "Crypto": 2500}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1079021, "Crypto": 2500}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1131510, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1147080, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1152840, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1164368, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1187772, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1199650, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1211646, "Crypto": 2500, "Allowance": 300}, note:"" },
    { from:"2025-12-01", rank:"Sr VP Operations", payments:{"ARS": 1283763, "Crypto": 2500, "Allowance": 300}, note:"" }
  ]},
  { id:21, name:"ANDREA MARTINEZ", team:"Teknion", activeFrom:"2010-08-02", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"30.436.672", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 197095, "Cash2": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 213191, "Cash2": 600}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 227042, "Cash2": 600}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 249398, "Cash2": 600}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 260482, "Cash2": 600}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 259065, "Cash2": 600}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 284585, "Cash2": 600}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 300935, "Cash2": 600}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 317285, "Cash2": 600}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 388912, "Cash2": 600}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 446292, "Cash2": 600}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 503672, "Canada": 500, "Cash2": 600}, note:"Suma Crypto — continúa relación de dependencia" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 600599, "Canada": 500, "Cash2": 600}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 686618, "Canada": 500, "Cash2": 600}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 772638, "Canada": 500, "Cash2": 600}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 869813, "Canada": 500, "Cash2": 600}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 902102, "Cash2": 1100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 931307, "Cash2": 1100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 957267, "Cash2": 1100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 991712, "Cash2": 1100}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1005461, "Cash2": 600}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1019121, "Cash2": 500}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1034408, "Cash2": 1150}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1045206, "Cash2": 1150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1052348, "Cash2": 1150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1104837, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1120407, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1126167, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1137428, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1160291, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1171894, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1183613, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-12-01", rank:"VP Production & Business Development", payments:{"ARS": 1255449, "Allowance": 300, "Cash2": 1150}, note:"" }
  ]},
  { id:179, name:"MARIA MARTA HERNANDEZ", team:"Steelcase", activeFrom:"2010-10-04", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"29.832.185", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 197095, "Cash2": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 213191, "Cash2": 600}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 227042, "Cash2": 600}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 249398, "Cash2": 600}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 260482, "Cash2": 600}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 259065, "Cash2": 600}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 284585, "Cash2": 600}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 300935, "Cash2": 600}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 317285, "Cash2": 600}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 388912, "Cash2": 600}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 446292, "Cash2": 600}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 503672, "Cash2": 600}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 600599, "Cash2": 600}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 686618, "Cash2": 600}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 772638, "Cash2": 600}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 869813, "Cash2": 600}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 902102, "Cash2": 600}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 931307, "Cash2": 900}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 957267, "Cash2": 900}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 991712, "Cash2": 900}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1005461, "Cash2": 900}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1019121, "Cash2": 900}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1034408, "Cash2": 1150}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1045206, "Cash2": 1150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1052348, "Cash2": 1150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1104837, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1120407, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1126167, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1137428, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1160291, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1171894, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1183613, "Allowance": 300, "Cash2": 1150}, note:"" },
    { from:"2025-12-01", rank:"Associate VP Production", payments:{"ARS": 1255449, "Allowance": 300, "Cash2": 1150}, note:"" }
  ]},
  { id:117, name:"MARIA GUILLERMINA GORDILLO", team:"HNI & Educational", activeFrom:"2010-02-15", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"28.680.361", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr. Operation Director", payments:{"Crypto": 1750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:262, name:"SILVANA HETENYI", team:"Kimball & Global", activeFrom:"2013-10-28", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"34.495.203", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Associate VP Production & Employee Branding Strategy", payments:{"Crypto": 1800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:15, name:"ANA PAULA BORGOGNO", team:"Haworth", activeFrom:"2018-09-04", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"38.324.059", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Director", payments:{"Crypto": 1800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:210, name:"MARIA MICAELA BLANCO", team:"Architectural Walls", activeFrom:"2014-12-09", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"35.972.007", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 157950, "Cash2": 660}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 174046, "Cash2": 660}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 187897, "Cash2": 660}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Director", payments:{"Crypto": 1750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:56, name:"CECILIA CASAS", team:"Steelcase", activeFrom:"2023-07-03", activeTo:"", area:"CAD", supervisor:"MARIA MARTA HERNANDEZ", notes:[], dni:"86.091.005", address:"", personalEmail:"",
    history:[
    { from:"2023-07-01", rank:"", payments:{"Canada": 2000}, note:"" },
    { from:"2024-06-01", rank:"Designer Cad & Space Planner", payments:{"Canada": 2200}, note:"" }
  ]},
  { id:105, name:"MARIA FLORENCIA MUIÑOS", team:"Steelcase", activeFrom:"2016-09-12", activeTo:"", area:"CAD", supervisor:"MARIA MARTA HERNANDEZ", notes:[], dni:"33.811.000", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 165095, "Cash2": 400}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 181191, "Cash2": 400}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 195042, "Cash2": 400}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 214078, "Cash2": 400}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 224567, "Cash2": 400}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 222556, "Cash2": 400}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 247585, "Cash2": 400}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 263935, "Cash2": 400}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 280285, "Cash2": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 342510, "Cash2": 400}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 393044, "Cash2": 400}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 443578, "Cash2": 400}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 546053, "Cash2": 400}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 627505, "Cash2": 400}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 708958, "Cash2": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 805292, "Cash2": 400}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 837581, "Cash2": 400}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 866786, "Cash2": 400}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 892746, "Cash2": 400}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 927191, "Cash2": 600}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 940940, "Cash2": 600}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 954600, "Cash2": 600}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 968919, "Cash2": 600}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 986859, "Cash2": 800}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1039348, "Cash2": 800}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1054918, "Cash2": 800}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1060678, "Cash2": 800}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1071285, "Cash2": 800}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1081998, "Cash2": 800}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1092818, "Cash2": 800}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1103746, "Cash2": 800}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1114783, "Cash2": 800}, note:"" },
    { from:"2025-12-01", rank:"Team Manager", payments:{"ARS": 1185931, "Cash2": 800}, note:"" }
  ]},
  { id:154, name:"LUCIA MACIAS", team:"Architectural Walls", activeFrom:"2017-03-01", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"35.265.180", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1300}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Canada": 1450, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Manager", payments:{"Canada": 1450, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:219, name:"NATALIA CAMACHO", team:"AMQ", activeFrom:"2015-09-01", activeTo:"", area:"CAD", supervisor:"MARIA MARTA HERNANDEZ", notes:[], dni:"34.684.047", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 1310, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Canada": 1450, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Canada": 1450, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Manager", payments:{"Canada": 1450, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:124, name:"MARIA INES BARBA", team:"Steelcase Bis", activeFrom:"2017-10-02", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"6.314.814", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 1600}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 1500, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"Team Supervisor", payments:{"Canada": 1680, "Healthcare": 120}, note:"" }
  ]},
  { id:27, name:"YOSVENT ANUEL", team:"Architectural Walls", activeFrom:"2021-05-03", activeTo:"", area:"CAD", supervisor:"LUCIA MACIAS", notes:[], dni:"95.893.914", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:116, name:"GUADALUPE BELTRAN", team:"Teknion", activeFrom:"2020-01-02", activeTo:"", area:"CAD", supervisor:"ANDREA MARTINEZ", notes:[], dni:"37.035.488", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 145025, "Cash2": 350}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 161121, "Cash2": 350}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 174972, "Cash2": 350}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 192923, "Cash2": 350}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 203115, "Cash2": 350}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 200808, "Cash2": 350}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 225591, "Cash2": 350}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 241941, "Cash2": 350}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 258291, "Cash2": 350}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 312452, "Cash2": 350}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 358551, "Cash2": 350}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 404650, "Cash2": 350}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-10-01", rank:"Team Manager", payments:{"Crypto": 1550, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:178, name:"MARIA LAURA BOBADILLA", team:"MillerKnoll", activeFrom:"2011-05-13", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"29.698.756", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 153810, "Cash2": 200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 169906, "Cash2": 200}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 183757, "Cash2": 200}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 203893, "Cash2": 200}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 214580, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 212768, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 237960, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 254310, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 270660, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 330018, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 379151, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 428284, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 542277, "Cash2": 350}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 625251, "Cash2": 350}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 708226, "Cash2": 350}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 804840, "Cash2": 350}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 837129, "Cash2": 350}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 866334, "Cash2": 350}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 892294, "Cash2": 350}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 926739, "Cash2": 350}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 940488, "Cash2": 350}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 954148, "Cash2": 350}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 968460, "Cash2": 550}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 979258, "Cash2": 550}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 986400, "Cash2": 650}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1038889, "Cash2": 650}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1054459, "Cash2": 650}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1060219, "Cash2": 650}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1070821, "Cash2": 650}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1081530, "Cash2": 650}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1092345, "Cash2": 650}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1103268, "Cash2": 650}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1114301, "Cash2": 650}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1185444, "Cash2": 650}, note:"" },
    { from:"2026-02-01", rank:"Team Manager", payments:{"ARS": 1185444, "Cash2": 800}, note:"" }
  ]},
  { id:184, name:"MARIAN SCORZZA", team:"Architectural Walls", activeFrom:"2020-01-02", activeTo:"", area:"CAD", supervisor:"YOSVENT ANUEL", notes:[], dni:"19.119.641", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1300}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1300, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:17, name:"ANALIA COLOM", team:"Steelcase Bis", activeFrom:"2016-06-23", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"31.674.895", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:14, name:"AMANDA COSTA", team:"HNI & Educational", activeFrom:"2010-11-02", activeTo:"", area:"CAD", supervisor:"MARIA GUILLERMINA GORDILLO", notes:[], dni:"30.912.145", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 133810, "Cash2": 300}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 149906, "Cash2": 300}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 163757, "Cash2": 300}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 180000, "Cash2": 300}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 191715, "Cash2": 300}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 189308, "Cash2": 300}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 214010, "Cash2": 300}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 230360, "Cash2": 300}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 246710, "Cash2": 300}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 298563, "Cash2": 300}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 341985, "Cash2": 300}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 385407, "Cash2": 300}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 496855, "Cash2": 300}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 574502, "Cash2": 300}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:188, name:"MARIANNIE SCARLET VERA CABELLO", team:"Kimball & Global", activeFrom:"2019-05-02", activeTo:"", area:"CAD", supervisor:"SILVANA HETENYI", notes:[], dni:"95.916.179", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:152, name:"LUCIA COREL TANABE", team:"Haworth", activeFrom:"2019-06-24", activeTo:"", area:"CAD", supervisor:"ANA PAULA BORGOGNO", notes:[], dni:"34.393.423", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Canada": 1400, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Canada": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor", payments:{"Canada": 1400, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:233, name:"PAULA AYOSA DIAZ", team:"Steelcase", activeFrom:"2021-12-01", activeTo:"", area:"CAD", supervisor:"MARIA FLORENCIA MUIÑOS", notes:[], dni:"39.292.177", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 107095, "Cash2": 100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 137042, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 154660, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 211139, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 227489, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 243889, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 294311, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 337733, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 381155, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 492214, "Cash2": 200}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 569860, "Cash2": 200}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 647507, "Cash2": 200}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 742980, "Cash2": 200}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 779318, "Cash2": 200}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 808523, "Cash2": 200}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 834483, "Cash2": 200}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 868928, "Cash2": 200}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 882677, "Cash2": 200}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 896337, "Cash2": 200}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 909782, "Cash2": 200}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 920580, "Cash2": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1030000, "Cash2": 400}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1082489, "Cash2": 400}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1098059, "Cash2": 400}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1103819, "Cash2": 400}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1114857, "Cash2": 400}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1126006, "Cash2": 400}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1137266, "Cash2": 400}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1148638, "Cash2": 400}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1160125, "Cash2": 400}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1231726, "Cash2": 400}, note:"" },
    { from:"2026-01-01", rank:"Team Supervisor", payments:{"ARS": 1231726, "Cash2": 550}, note:"" }
  ]},
  { id:185, name:"MARIANA PAVON", team:"Steelcase", activeFrom:"2021-04-12", activeTo:"", area:"CAD", supervisor:"MARIA MARTA HERNANDEZ", notes:[], dni:"39.353.215", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939, "Cash2": 200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035, "Cash2": 200}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 200}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 200}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 211139, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 227489, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 243839, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 294311, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 337733, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 381155, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 492214, "Cash2": 200}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 569860, "Cash2": 200}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 647507, "Cash2": 200}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 742980, "Cash2": 200}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 779318, "Cash2": 200}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 808523, "Cash2": 200}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 834483, "Cash2": 200}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 868928, "Cash2": 300}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 882677, "Cash2": 300}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 896337, "Cash2": 300}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 909782, "Cash2": 300}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 920580, "Cash2": 300}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 927722, "Cash2": 400}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 980211, "Cash2": 400}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 995781, "Cash2": 400}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1001541, "Cash2": 400}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1011556, "Cash2": 400}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1021672, "Cash2": 400}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1031889, "Cash2": 400}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1042208, "Cash2": 400}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1052630, "Cash2": 400}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1123156, "Cash2": 400}, note:"" },
    { from:"2026-02-01", rank:"Team Supervisor", payments:{"ARS": 1123156, "Cash2": 550}, note:"" }
  ]},
  { id:142, name:"LAURA SOSA", team:"Haworth", activeFrom:"2021-05-17", activeTo:"", area:"CAD", supervisor:"ANA PAULA BORGOGNO", notes:[], dni:"38.992.441", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939, "Cash2": 100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035, "Cash2": 100}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 900, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1200, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:181, name:"MARIA SOL PONTE VILELA", team:"Kimball & Global", activeFrom:"2021-04-12", activeTo:"", area:"CAD", supervisor:"SILVANA HETENYI", notes:[], dni:"40.980.261", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:193, name:"MARTA VICTORIA MEDINA", team:"Steelcase", activeFrom:"2022-06-14", activeTo:"", area:"CAD", supervisor:"MARIA FLORENCIA MUIÑOS", notes:[], dni:"95.514.878", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:151, name:"LUCIA CIRRINCHIONE", team:"HNI & Educational", activeFrom:"2021-01-04", activeTo:"", area:"CAD", supervisor:"PILAR BOADA", notes:[], dni:"40.004.795", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 211139, "Cash2": 100}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 227489, "Cash2": 100}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 243839, "Cash2": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 294311, "Cash2": 100}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 337733, "Cash2": 100}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 381155, "Cash2": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 492214, "Cash2": 100}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 569860, "Cash2": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:108, name:"FRANCISCO CHUA IURCOVICH", team:"Architectural Walls", activeFrom:"2022-01-03", activeTo:"", area:"CAD", supervisor:"YOSVENT ANUEL", notes:[], dni:"39.906.727", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 180}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1100, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:162, name:"LUIS JOSE ROMERO TRIANA", team:"Architectural Walls", activeFrom:"2023-02-13", activeTo:"", area:"CAD", supervisor:"MARIA MICAELA BLANCO", notes:[], dni:"95.826.488", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 170}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:146, name:"LOLA GARCIA HAMILTON", team:"Steelcase", activeFrom:"2022-07-18", activeTo:"", area:"CAD", supervisor:"MARIANA PAVON", notes:[], dni:"42.664.306", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2026-02-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 1050, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:71, name:"DANILA IORLANO", team:"Steelcase Bis", activeFrom:"2023-01-09", activeTo:"", area:"CAD", supervisor:"ANALIA COLOM", notes:[], dni:"41.645.677", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 170}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:239, name:"PILAR BOADA", team:"Steelcase", activeFrom:"2022-12-05", activeTo:"", area:"CAD", supervisor:"MARIA FLORENCIA MUIÑOS", notes:[], dni:"41.668.299", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:212, name:"MICAL CHINCHAZO TERZI", team:"HNI & Educational", activeFrom:"2022-05-23", activeTo:"", area:"CAD", supervisor:"AMANDA COSTA", notes:[], dni:"62.962.784", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:125, name:"ISIDORO CASSINI", team:"Architectural Walls", activeFrom:"2023-07-03", activeTo:"", area:"CAD", supervisor:"YOSVENT ANUEL", notes:[], dni:"41.205.058", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 130}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-12-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:24, name:"ANTONELLA HENEN", team:"AMQ", activeFrom:"2022-05-16", activeTo:"", area:"CAD", supervisor:"NATALIA CAMACHO", notes:[], dni:"41.396.491", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:279, name:"XAVIER VALERA", team:"Kimball & Global", activeFrom:"2022-05-16", activeTo:"", area:"CAD", supervisor:"SILVANA HETENYI", notes:[], dni:"96.015.060", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:242, name:"PILAR LOPEZ LEIVA", team:"Presentations", activeFrom:"2022-07-18", activeTo:"", area:"CAD", supervisor:"MARIELA RICO", notes:[], dni:"40.127.106", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2026-01-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:74, name:"DELFINA ACOSTA BLADES", team:"AMQ", activeFrom:"2022-12-05", activeTo:"", area:"CAD", supervisor:"NATALIA CAMACHO", notes:[], dni:"41.023.642", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-07-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:51, name:"CATALINA GUERBEROFF", team:"Steelcase Bis", activeFrom:"2023-07-03", activeTo:"", area:"CAD", supervisor:"ANALIA COLOM", notes:[], dni:"39.560.883", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:86, name:"EMILIANO GESTO", team:"Architectural Walls", activeFrom:"2023-06-21", activeTo:"", area:"CAD", supervisor:"MARIA MICAELA BLANCO", notes:[], dni:"38.612.127", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 130}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2026-01-01", rank:"Sr Designer Cad & Space Planner", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:222, name:"NICOLAS CHIOZZA", team:"Architectural Walls", activeFrom:"2023-09-11", activeTo:"", area:"CAD", supervisor:"YOSVENT ANUEL", notes:[], dni:"39.757.308", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 130}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:2, name:"AGOSTINA NADIA LIPORACE", team:"Architectural Walls", activeFrom:"2023-02-13", activeTo:"", area:"CAD", supervisor:"MARIA MICAELA BLANCO", notes:[], dni:"39.924.469", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:54, name:"CATERINA ARRIGNON ALLER", team:"Kimball & Global", activeFrom:"2023-09-11", activeTo:"", area:"CAD", supervisor:"SILVANA HETENYI", notes:[], dni:"42.455.134", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:211, name:"MICAELA MUÑOZ", team:"HNI & Educational", activeFrom:"2023-11-13", activeTo:"2026-03-31", area:"", supervisor:"", notes:[], dni:"42.999.446", address:"", personalEmail:"",
    history:[
    { from:"2023-11-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 350, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 550, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:65, name:"DAFNE ANEAS", team:"MillerKnoll", activeFrom:"2024-01-03", activeTo:"", area:"CAD", supervisor:"MARIA LAURA BOBADILLA", notes:[], dni:"40.229.467", address:"", personalEmail:"",
    history:[
    { from:"2023-12-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:104, name:"FLORENCIA MASAS", team:"Steelcase Bis", activeFrom:"2024-03-11", activeTo:"", area:"CAD", supervisor:"ANALIA COLOM", notes:[], dni:"41.894.638", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:157, name:"LUCIA ZIMERMAN", team:"Steelcase", activeFrom:"2024-04-03", activeTo:"", area:"CAD", supervisor:"PAULA AYOSA DIAZ", notes:[], dni:"38.614.767", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:139, name:"JULIETA BELEN PIERETTI", team:"Steelcase", activeFrom:"2024-05-06", activeTo:"", area:"CAD", supervisor:"PAULA AYOSA DIAZ", notes:[], dni:"40.675.842", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:234, name:"PAULA CATRI", team:"Steelcase", activeFrom:"2024-05-13", activeTo:"", area:"CAD", supervisor:"MARIANA PAVON", notes:[], dni:"44.162.434", address:"", personalEmail:"",
    history:[
    { from:"2024-05-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 520, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Canada": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Canada": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-08-01", rank:"Designer Cad & Space Planner", payments:{"Canada": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:135, name:"JUAN BAUTISTA GONZALEZ FERNANDEZ", team:"Architectural Walls", activeFrom:"2024-06-24", activeTo:"", area:"CAD", supervisor:"MARIA MICAELA BLANCO", notes:[], dni:"42.253.141", address:"", personalEmail:"",
    history:[
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:213, name:"MIJAL SHARON STRAJMAN", team:"Steelcase", activeFrom:"2024-06-24", activeTo:"", area:"CAD", supervisor:"MARIA FLORENCIA MUIÑOS", notes:[], dni:"41.710.133", address:"", personalEmail:"",
    history:[
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:259, name:"SELENE ACOSTA", team:"Steelcase", activeFrom:"2024-11-04", activeTo:"", area:"CAD", supervisor:"PAULA AYOSA DIAZ", notes:[], dni:"37.699.244", address:"", personalEmail:"",
    history:[
    { from:"2024-10-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 120}, note:"" },
    { from:"2025-06-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 120}, note:"" }
  ]},
  { id:107, name:"FLORENCIA SANCHEZ GALINDO", team:"Kimball & Global", activeFrom:"2025-01-27", activeTo:"", area:"CAD", supervisor:"MARIA SOL PONTE VILELA", notes:[], dni:"38.442.946", address:"", personalEmail:"",
    history:[
    { from:"2025-01-01", rank:"", payments:{"Mono": 940000}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 650, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:42, name:"CANDELA YURI", team:"Steelcase", activeFrom:"2025-03-25", activeTo:"", area:"CAD", supervisor:"MARTA VICTORIA MEDINA", notes:[], dni:"42.233.350", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Mono": 950000}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:59, name:"CLARA AVALOS", team:"Steelcase", activeFrom:"2025-03-25", activeTo:"", area:"CAD", supervisor:"MARIANA PAVON", notes:[], dni:"43.441.431", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Mono": 950000}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:18, name:"ANALIA QUINTEIRO", team:"Teknion", activeFrom:"2025-04-07", activeTo:"", area:"CAD", supervisor:"GUADALUPE BELTRAN", notes:[], dni:"28.693.057", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Mono": 1500000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"Mono": 1600000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 1100, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:153, name:"LUCIA DOURS", team:"HNI & Educational", activeFrom:"2025-06-23", activeTo:"", area:"CAD", supervisor:"AMANDA COSTA", notes:[], dni:"41.396.227", address:"", personalEmail:"",
    history:[
    { from:"2025-06-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:246, name:"ROBERTO GONZALEZ LERARIO", team:"Architectural Walls", activeFrom:"2025-07-01", activeTo:"", area:"CAD", supervisor:"MARIA MICAELA BLANCO", notes:[], dni:"42.145.826", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-02-01", rank:"Designer Cad & Space Planner", payments:{"Mono": 1200000}, note:"" }
  ]},
  { id:12, name:"ALIBEL RODRIGUEZ", team:"Architectural Walls", activeFrom:"2025-07-14", activeTo:"", area:"CAD", supervisor:"YOSVENT ANUEL", notes:[], dni:"96.116.673", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 650, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:145, name:"LISA LARROSA", team:"AMQ", activeFrom:"2025-07-14", activeTo:"", area:"CAD", supervisor:"NATALIA CAMACHO", notes:[], dni:"43.723.126", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Mono": 900000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2026-01-01", rank:"Jr Designer Cad & Space Planner", payments:{"Crypto": 600, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:159, name:"LUCILA GONZALEZ MONTI", team:"Steelcase", activeFrom:"2025-08-05", activeTo:"", area:"CAD", supervisor:"MARIA FLORENCIA MUIÑOS", notes:[], dni:"41.586.614", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:226, name:"NICOLE TOMEY", team:"Steelcase", activeFrom:"2025-09-01", activeTo:"", area:"CAD", supervisor:"PILAR BOADA", notes:[], dni:"50.387.728", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"Mono": 1200000}, note:"" },
    { from:"2026-01-01", rank:"Jr Designer Cad & Space Planner", payments:{"Crypto": 700, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:6, name:"AGUSTINA MARIEL GOMEZ", team:"Teknion", activeFrom:"2025-12-01", activeTo:"", area:"CAD", supervisor:"GUADALUPE BELTRAN", notes:[], dni:"42.471.203", address:"", personalEmail:"",
    history:[
    { from:"2025-11-01", rank:"Jr Designer In Training", payments:{"Crypto": 700, "Healthcare": 150}, note:"" }
  ]},
  { id:28, name:"ARACELI ALONSO", team:"Haworth", activeFrom:"2026-01-15", activeTo:"", area:"CAD", supervisor:"LUCIA COREL TANABE", notes:[], dni:"42.290.654", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"Jr Designer In Training", payments:{"Crypto": 750, "Healthcare": 150}, note:"" }
  ]},
  { id:4, name:"AGUSTIN ASSELBORN", team:"Steelcase Bis", activeFrom:"2026-01-26", activeTo:"", area:"CAD", supervisor:"ANALIA COLOM", notes:[], dni:"41.104.972", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"Jr Designer In Training", payments:{"Crypto": 700, "Healthcare": 150}, note:"" }
  ]},
  { id:235, name:"PAULA DA PONTE", team:"Presentations", activeFrom:"2026-01-26", activeTo:"", area:"CAD", supervisor:"MARIANA PAVON", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"Jr Designer In Training", payments:{"Crypto": 550, "Healthcare": 150}, note:"" }
  ]},
  { id:232, name:"PAMELA SALINAS CASADO", team:"MillerKnoll", activeFrom:"2026-02-09", activeTo:"", area:"CAD", supervisor:"MARIA LAURA BOBADILLA", notes:[], dni:"36.027.909", address:"", personalEmail:"",
    history:[
    { from:"2026-02-01", rank:"Jr Designer In Training", payments:{"Crypto": 850, "Healthcare": 150}, note:"" }
  ]},
  { id:40, name:"CAMILA DIAZ", team:"Steelcase", activeFrom:"2026-02-23", activeTo:"", area:"CAD", supervisor:"MARIANA PAVON", notes:[], dni:"40.731.632", address:"", personalEmail:"",
    history:[
    { from:"2026-02-01", rank:"Jr Designer In Training", payments:{"Crypto": 850, "Healthcare": 150}, note:"" }
  ]},
  { id:25, name:"ANTONELLA RIMOLI", team:"Sales Administration", activeFrom:"2021-09-20", activeTo:"", area:"SALES SUPPORT", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"36.829.346", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 900}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1700, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1700, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-12-01", rank:"Sales Administration Manager", payments:{"Crypto": 2100, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:223, name:"NICOLAS GIUDICHE", team:"Sales Administration", activeFrom:"2022-09-19", activeTo:"", area:"SALES SUPPORT", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"38.795.232", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1300, "Healthcare": 100, "Cash2": 300}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 100, "Cash2": 300}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120, "Cash2": 300}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1600, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-12-01", rank:"Learning & Onboarding Manager", payments:{"Crypto": 2000, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:243, name:"RICARDO CEDEÑO", team:"Empire - SA", activeFrom:"2022-08-16", activeTo:"", area:"SALES SUPPORT", supervisor:"ANTONELLA RIMOLI", notes:[], dni:"95.870.820", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 1150, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1150, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1150, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1350, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor Of Sales Administration", payments:{"Crypto": 1350, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:204, name:"MAURO NISSEN", team:"Empire - SA", activeFrom:"2023-04-03", activeTo:"", area:"SALES SUPPORT", supervisor:"ANTONELLA RIMOLI", notes:[], dni:"38.429.945", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 850, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 850, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 170}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2026-02-01", rank:"Team Leader Of Sales Administration", payments:{"Crypto": 1200, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:156, name:"LUCIA TORRES", team:"Empire - SA", activeFrom:"2022-07-12", activeTo:"", area:"SALES SUPPORT", supervisor:"ANTONELLA RIMOLI", notes:[], dni:"40.993.603", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 850, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 850, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 170}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2026-01-01", rank:"Team Leader Of Sales Administration", payments:{"Crypto": 1200, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:53, name:"CATALINA PINGARO", team:"Waldners", activeFrom:"2023-09-05", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"39.458.990", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-08-01", rank:"Team Supervisor Of Sales Administration", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:23, name:"ANGELA BOYD", team:"Empire - SA", activeFrom:"2021-09-22", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"95.900.916", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 135000, "Cash2": 100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 151096, "Cash2": 100}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 164947, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 181194, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 191189, "Cash2": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:174, name:"MARIA CECILIA BRACHO", team:"AFD - SA", activeFrom:"2023-04-24", activeTo:"", area:"SALES SUPPORT", supervisor:"ANTONELLA RIMOLI", notes:[], dni:"96.022.101", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor Of Sales Administration", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:137, name:"JUAN PABLO PRIETO", team:"", activeFrom:"2024-01-04", activeTo:"2026-02-28", area:"SALES SUPPORT", supervisor:"Ricardo Cedeño", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:253, name:"SAMIR ANIS MAKAREM LABARCA", team:"Empire - SA", activeFrom:"2022-03-28", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"95.918.464", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 650}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor Of Sales Administration", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:268, name:"STEFANY BRITO", team:"Empire - SA", activeFrom:"2022-03-28", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"95.880.534", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 650}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Team Supervisor Of Sales Administration", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:126, name:"IVO DANIEL CORVALAN", team:"ImageWorks", activeFrom:"2023-03-04", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"36.163.093", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-11-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:266, name:"SONIA BORSETTI", team:"Perdue", activeFrom:"2024-12-08", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"29.304.273", address:"", personalEmail:"",
    history:[
    { from:"2024-08-01", rank:"", payments:{"Crypto": 800}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:39, name:"CAMILA DI RIZIO", team:"Empire - SA", activeFrom:"2021-01-10", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 650}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:252, name:"ROMINA HENRIQUEZ", team:"Waldners", activeFrom:"2021-11-10", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"96.008.084", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 650}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:218, name:"NADIA OSMAN", team:"Empire - SA", activeFrom:"2021-12-01", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"32.173.239", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 125000, "Cash2": 100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 141096, "Cash2": 100}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 155547, "Cash2": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 173260, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 186254, "Cash2": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 183749, "Cash2": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 208368, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 222018, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 235668, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 291426, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 334423, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 377420, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 492214, "Cash2": 200}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 569860, "Cash2": 200}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 647507, "Cash2": 200}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"ARS": 737744, "Cash2": 200}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 743418, "Cash2": 200}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 775868, "Cash2": 200}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 805073, "Cash2": 200}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 831033, "Cash2": 200}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 857193, "Cash2": 200}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 879223, "Cash2": 200}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 892883, "Cash2": 200}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 906276, "Cash2": 200}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 917074, "Cash2": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 924216, "Cash2": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 976705, "Cash2": 350}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 992275, "Cash2": 350}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 998035, "Cash2": 350}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1008015, "Cash2": 350}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1018096, "Cash2": 350}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1028276, "Cash2": 350}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1038559, "Cash2": 450}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1048945, "Cash2": 450}, note:"" },
    { from:"2025-12-01", rank:"Sr. Sales Administration Specialist", payments:{"ARS": 1119434, "Cash2": 450}, note:"" }
  ]},
  { id:35, name:"BIANCA JAIME", team:"Empire - SA", activeFrom:"2022-10-04", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"38.993.306", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:94, name:"FACUNDO MIRANDA", team:"Empire - SA", activeFrom:"2022-09-01", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"41.646.185", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 900}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 750, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:96, name:"FACUNDO SEGOVIA", team:"Empire - SA", activeFrom:"2022-12-07", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"38.230.685", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:175, name:"MARIA EUGENIA MEDINA", team:"Empire - SA", activeFrom:"2022-12-19", activeTo:"", area:"SALES SUPPORT", supervisor:"SAMIR ANIS MAKAREM LABARCA", notes:[], dni:"35.885.854", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 700}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 700, "Allowance": 300}, note:"" }
  ]},
  { id:122, name:"HUGO CONTRAMAESTRE", team:"Waldners", activeFrom:"2023-01-30", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"508454", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Canada": 840}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Canada": 800}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"Crypto": 800}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 850}, note:"" },
    { from:"2026-03-01", rank:"Sales Administration Specialist", payments:{"Crypto": 950, "Healthcare": 150}, note:"" }
  ]},
  { id:60, name:"CLARA BORGOGNO", team:"Empire - SA", activeFrom:"2022-12-05", activeTo:"", area:"SALES SUPPORT", supervisor:"SAMIR ANIS MAKAREM LABARCA", notes:[], dni:"41.562.329", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:114, name:"GONZALO MARCHETTA", team:"Empire - SA", activeFrom:"2023-02-06", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"45.819.609", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 450, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:203, name:"MAURO MAFFIODO", team:"Empire - SA", activeFrom:"2023-05-01", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"38.922.169", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:73, name:"DEBORA PAEZ", team:"Waldners", activeFrom:"2024-04-15", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"29.947.677", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:13, name:"ALMA STROPENI", team:"AFD - SA", activeFrom:"2023-06-21", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"43.017.521", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:229, name:"ORIANA ABALLAY", team:"Empire - SA", activeFrom:"2023-04-17", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"42.878.558", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:180, name:"MARIA SOL BERECOECHEA", team:"Empire - SA", activeFrom:"2023-07-03", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"39.865.350", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:5, name:"AGUSTIN LENCINA ROJAS", team:"Empire - SA", activeFrom:"2023-01-03", activeTo:"", area:"SALES SUPPORT", supervisor:"STEFANY BRITO", notes:[], dni:"40.635.065", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 120000}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 135050}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 143050}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 141344}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 153644}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 167294}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 180944}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 229575}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 263446}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 297317}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 450, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 450, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 550, "Healthcare": 120, "Allowance": 110}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:131, name:"JESUS RANGEL ROBERTI", team:"Empire - SA", activeFrom:"2023-08-21", activeTo:"", area:"SALES SUPPORT", supervisor:"STEFANY BRITO", notes:[], dni:"96.030.844", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 510, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Canada": 600, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Canada": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Canada": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:112, name:"GIANNE PAOLA LOPEZ", team:"Waldners", activeFrom:"2023-06-01", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"95.938.785", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:76, name:"DELFINA ECHAYRE", team:"Empire - SA", activeFrom:"2023-10-09", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"42.375.909", address:"", personalEmail:"",
    history:[
    { from:"2023-09-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:72, name:"DEBORA BARENBOIM GAUTIER", team:"AFD - SA", activeFrom:"2023-12-06", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"43.736.680", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:225, name:"NICOLAS SCALABRINI", team:"Empire - SA", activeFrom:"2024-07-15", activeTo:"", area:"SALES SUPPORT", supervisor:"RICARDO CEDEÑO", notes:[], dni:"36.949.777", address:"", personalEmail:"",
    history:[
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:44, name:"CARLA GIMENEZ", team:"Empire - SA", activeFrom:"2024-04-15", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"42.155.544", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"Sr. Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:275, name:"VALENTINA TORRES", team:"Waldners", activeFrom:"2024-04-22", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"42.720.420", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:273, name:"TOMAS RUIVAL", team:"ABI", activeFrom:"2025-08-18", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"34.318.690", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Mono": 1300000}, note:"" },
    { from:"2025-12-01", rank:"Sales Administration Specialist", payments:{"Crypto": 850, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:45, name:"CARLA MINOLFI", team:"", activeFrom:"2024-09-09", activeTo:"2025-06-20", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"42.155.544", address:"", personalEmail:"",
    history:[
    { from:"2024-09-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 500, "Healthcare": 120}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 500, "Healthcare": 150, "Allowance": 220}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 220}, note:"" }
  ]},
  { id:37, name:"BRENDA HEIT", team:"AFD - SA", activeFrom:"2025-01-27", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"39.172.059", address:"", personalEmail:"",
    history:[
    { from:"2025-01-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 500, "Healthcare": 150, "Allowance": 220}, note:"" },
    { from:"2025-06-01", rank:"Sales Administration Specialist", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 220}, note:"" }
  ]},
  { id:75, name:"DELFINA DUMANSKY", team:"Waldners", activeFrom:"2025-02-17", activeTo:"", area:"SALES SUPPORT", supervisor:"STEFANY BRITO", notes:[], dni:"41.023.642", address:"", personalEmail:"",
    history:[
    { from:"2025-02-01", rank:"", payments:{"Mono": 940000}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2025-10-01", rank:"Sales Administration Specialist", payments:{"Mono": 1200000}, note:"" }
  ]},
  { id:97, name:"FELICITAS GIRAUD", team:"", activeFrom:"2025-05-19", activeTo:"2026-01-21", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-05-01", rank:"", payments:{"Mono": 950000}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:168, name:"MALENA ZAPATEL", team:"Empire - SA", activeFrom:"2025-06-09", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"42.150.217", address:"", personalEmail:"",
    history:[
    { from:"2025-06-01", rank:"Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150}, note:"" }
  ]},
  { id:230, name:"OSVALDO GUARNIERI", team:"Creative Office", activeFrom:"2025-06-09", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"28.848.913", address:"", personalEmail:"",
    history:[
    { from:"2025-06-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-02-01", rank:"Jr. Sales Administration Specialist", payments:{"Mono": 1200000}, note:"" }
  ]},
  { id:231, name:"PABLO SCRIGNA", team:"AFD - SA", activeFrom:"2025-07-07", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"34.230.798", address:"", personalEmail:"",
    history:[
    { from:"2025-06-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Mono": 1040000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:144, name:"LAUTARO MARTINEZ", team:"Empire - SA", activeFrom:"2025-07-07", activeTo:"", area:"SALES SUPPORT", supervisor:"STEFANY BRITO", notes:[], dni:"45.825.128", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Mono": 960000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1020000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1100000}, note:"" },
    { from:"2026-02-01", rank:"Jr. Sales Administration Specialist", payments:{"Mono": 1200000}, note:"" }
  ]},
  { id:199, name:"MATIAS GALARZA", team:"Empire - SA", activeFrom:"2025-08-18", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"45.008.722", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"Mono": 960000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 600, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:19, name:"ANALY GONZALEZ LOPEZ", team:"AFD - SA", activeFrom:"2025-08-18", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"95.956.861", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"Mono": 1200000}, note:"" },
    { from:"2026-02-01", rank:"", payments:{"Mono": 1300000}, note:"" },
    { from:"2026-03-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 850, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:109, name:"FRANCO ABOY", team:"AFD - SA", activeFrom:"2025-09-22", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"38.285.350", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"Mono": 1200000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"Mono": 1263000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:281, name:"YOHANNA DE MORALES", team:"AFD - SA", activeFrom:"2025-10-13", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"35.003.709", address:"", personalEmail:"",
    history:[
    { from:"2025-10-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 600, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:38, name:"BRUNO BOGGIO", team:"Waldners", activeFrom:"2025-10-20", activeTo:"", area:"SALES SUPPORT", supervisor:"CATALINA PINGARO", notes:[], dni:"40.009.025", address:"", personalEmail:"",
    history:[
    { from:"2025-10-01", rank:"", payments:{"Mono": 1200000}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"Crypto": 750, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" },
    { from:"2026-02-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 850, "Healthcare": 150}, note:"" }
  ]},
  { id:149, name:"LUCAS BEVERINA", team:"AFD - SA", activeFrom:"2025-10-20", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"40.586.489", address:"", personalEmail:"",
    history:[
    { from:"2025-01-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 80}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 650, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:192, name:"MARKUS CONEJEROS VERON", team:"Franklin Interiors", activeFrom:"2025-11-03", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"93.582.195", address:"", personalEmail:"",
    history:[
    { from:"2025-10-01", rank:"", payments:{"Mono": 1200000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:215, name:"MILAGROS SOLANO", team:"Perdue", activeFrom:"2025-11-17", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"43.443.289", address:"", personalEmail:"",
    history:[
    { from:"2025-11-01", rank:"", payments:{"Mono": 1000000}, note:"" },
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 600, "Healthcare": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:67, name:"DAMIAN GALLEGO", team:"AFD - SA", activeFrom:"2025-08-12", activeTo:"", area:"SALES SUPPORT", supervisor:"MARIA CECILIA BRACHO", notes:[], dni:"40.673.267", address:"", personalEmail:"",
    history:[
    { from:"2025-12-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150}, note:"" }
  ]},
  { id:258, name:"SEBASTIAN FISZ", team:"Empire - SA", activeFrom:"2025-08-12", activeTo:"", area:"SALES SUPPORT", supervisor:"MAURO NISSEN", notes:[], dni:"38.456.416", address:"", personalEmail:"",
    history:[
    { from:"2025-12-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 750, "Healthcare": 150}, note:"" }
  ]},
  { id:194, name:"MARTIN ESTEVEZ VILLANUEVA", team:"Empire - SA", activeFrom:"2026-01-19", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"40.397.399", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 700, "Healthcare": 150}, note:"" }
  ]},
  { id:160, name:"LUCIO CAFFARO", team:"Empire - SA", activeFrom:"2026-02-02", activeTo:"", area:"SALES SUPPORT", supervisor:"LUCIA TORRES", notes:[], dni:"39.546.809", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 850, "Healthcare": 150}, note:"" }
  ]},
  { id:217, name:"MIWA MARTINEZ", team:"SWOT", activeFrom:"2026-02-16", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"96.162.514", address:"", personalEmail:"",
    history:[
    { from:"2026-02-01", rank:"Jr. Sales Administration Specialist", payments:{"Crypto": 500, "Healthcare": 150}, note:"" }
  ]},
  { id:205, name:"MAXIMO EZEQUIEL LOSADA", team:"Training", activeFrom:"2026-02-03", activeTo:"", area:"SALES SUPPORT", supervisor:"NICOLAS GIUDICHE", notes:[], dni:"44.362.023", address:"", personalEmail:"",
    history:[
    { from:"2026-02-01", rank:"Jr. Sales Administration Specialist", payments:{"Mono": 1600000}, note:"" }
  ]},
  { id:251, name:"ROMAN MOLINA", team:"Visualizations", activeFrom:"2012-02-27", activeTo:"", area:"VISUALIZATIONS", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"94.734.304", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 112140, "Cash2": 4000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 128236, "Canada": 4000}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 142087, "Canada": 4000}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 163822, "Canada": 4000}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 172218, "Canada": 4000}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 171040, "Canada": 4000}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 195748, "Canada": 4000}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 212098, "Canada": 4000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 228448, "Canada": 4000}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 283865, "Canada": 4000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 325746, "Canada": 4000}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 367627, "Canada": 4000}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 494920, "Canada": 4000}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 452889, "Canada": 4000}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 488837, "Canada": 4000}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"ARS": 513955, "Canada": 4000}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 520792, "Canada": 4000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 537017, "Crypto": 4000}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 551619, "Crypto": 4000}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 564600, "Crypto": 4000}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 577600, "Crypto": 4000}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 581600, "Crypto": 4000}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 588600, "Crypto": 4000}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 597256, "Crypto": 4000}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 581600, "Crypto": 4200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 606226, "Crypto": 4200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 627987, "Crypto": 4500, "Cash2": 200, "Allowance": 200}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 635772, "Crypto": 4500, "Cash2": 200, "Allowance": 200}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 638652, "Crypto": 4500}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 641846, "Crypto": 4500, "Cash2": 200}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 648264, "Crypto": 4500}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 651505, "Crypto": 4500}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 654763, "Crypto": 4500}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 661311, "Crypto": 4500}, note:"" },
    { from:"2025-12-01", rank:"Sr. VP Creativity & Innovation", payments:{"ARS": 697924, "Crypto": 4500}, note:"" }
  ]},
  { id:198, name:"MATIAS DI PAOLA", team:"Visualizations", activeFrom:"2013-06-03", activeTo:"", area:"VISUALIZATIONS", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"35.854.752", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 3000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 3000, "Healthcare": 100}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"Canada": 3200, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 3200, "Healthcare": 200, "Cash2": 800}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 3000, "Healthcare": 100, "Cash2": 1000}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 3000, "Healthcare": 100, "Cash2": 1500}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 100, "Cash2": 1500}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 120, "Cash2": 1500}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 150}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 150, "Cash2": 400, "Allowance": 400}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 150}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 3200, "Healthcare": 150, "Cash2": 400}, note:"" },
    { from:"2025-08-01", rank:"Sr. VP Production", payments:{"Crypto": 3200, "Healthcare": 150}, note:"" }
  ]},
  { id:69, name:"DANIEL GIAMBATTISTELLI", team:"Visualizations", activeFrom:"2015-02-02", activeTo:"", area:"VISUALIZATIONS", supervisor:"ROMAN MOLINA", notes:[], dni:"28.272.792", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 2800}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 2800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 2800, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 2800, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"Art Director", payments:{"Crypto": 2800, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:90, name:"ERIK SCHONHALS", team:"Visualizations", activeFrom:"2021-01-11", activeTo:"", area:"VISUALIZATIONS", supervisor:"ROMAN MOLINA", notes:[], dni:"38.137.948", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1400}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1400, "Healthcare": 100}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"Canada": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"Crypto": 1900, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1900, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"Art Director", payments:{"Crypto": 1900, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:244, name:"RICHARD BORDENAVE", team:"Visualizations", activeFrom:"2021-01-04", activeTo:"", area:"VISUALIZATIONS", supervisor:"BARBARA FALUS", notes:[], dni:"37.699.225", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1300}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1300, "Healthcare": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"Crypto": 1700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1700, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"Senior 3D Artist - Team Lead", payments:{"Crypto": 1700, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:58, name:"CESAR CASTRO", team:"Visualizations", activeFrom:"2022-04-18", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"95.937.053", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 150}, note:"" },
    { from:"2026-02-01", rank:"Senior 3d Artist", payments:{"Crypto": 1700, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:68, name:"DAMIAN TORRES", team:"Visualizations", activeFrom:"2021-01-18", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"36.721.572", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1100}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"3D Artist", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:271, name:"TOMAS AGUSTIN PARODI", team:"Visualizations", activeFrom:"2023-02-01", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"40.395.689", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 800}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1250, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1250, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1250, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1250, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-05-01", rank:"Senior 3d Artist", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:245, name:"ROBERTO BRACHO", team:"Visualizations", activeFrom:"2023-06-01", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"19.085.652", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-05-01", rank:"3D Artist", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:81, name:"GREGORY TOVAR", team:"Visualizations", activeFrom:"2021-02-01", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"95.709.162", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 150, "Allowance": 100}, note:"" },
    { from:"2025-08-01", rank:"3D Artist - Networks & Communications", payments:{"Crypto": 1200, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:260, name:"SERGIO PEREZ", team:"Visualizations", activeFrom:"2023-01-04", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"24.265.332", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 750}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 750, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 100}, note:"" },
    { from:"2025-08-01", rank:"3D Artist", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:120, name:"HARONY SIERRA", team:"Visualizations", activeFrom:"2015-04-06", activeTo:"", area:"VISUALIZATIONS", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"95.278.246", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 144533}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 174480}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 189154}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 197665}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 950, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 950, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"Customer Relations Manager", payments:{"Crypto": 1300, "Healthcare": 150, "Allowance": 100}, note:"" }
  ]},
  { id:31, name:"BARBARA FALUS", team:"Visualizations", activeFrom:"2022-07-06", activeTo:"", area:"VISUALIZATIONS", supervisor:"MATIAS DI PAOLA", notes:[], dni:"36.400.748", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 900}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 400, "Cash2": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 100}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 100, "Cash2": 300}, note:"" },
    { from:"2025-08-01", rank:"Senior Project Manager", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 100}, note:"" }
  ]},
  { id:119, name:"GUSTAVO RADA", team:"Visualizations", activeFrom:"2025-04-07", activeTo:"", area:"VISUALIZATIONS", supervisor:"RICHARD BORDENAVE", notes:[], dni:"95.843.721", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150}, note:"" },
    { from:"2025-07-01", rank:"3D Artist", payments:{"Crypto": 1550, "Healthcare": 150}, note:"" }
  ]},
  { id:78, name:"DEMIAN COHEN", team:"", activeFrom:"2011-03-16", activeTo:"", area:"IT", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 154533, "Cash2": 250}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 170629, "Cash2": 250}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 185080, "Cash2": 250}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 209881, "Cash2": 250}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 100000, "Canada": 800}, note:"Suma Crypto — continúa relación de dependencia" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 113327, "Canada": 800}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 126977, "Canada": 800}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 140627, "Canada": 800}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 188007, "Canada": 800}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 217211, "Canada": 800}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 246415, "Canada": 800}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 283377, "Canada": 800}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 306869, "Canada": 800}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 353490, "Canada": 800}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 402282, "Canada": 800}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 402282, "Crypto": 800}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 426652, "Crypto": 800}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 439632, "Crypto": 800}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 452632, "Crypto": 800}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 463631, "Crypto": 800}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 470461, "Crypto": 800}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 477518, "Crypto": 800}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 488316, "Crypto": 800}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 486487, "Crypto": 800, "Allowance": 300}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 512731, "Crypto": 800, "Allowance": 300}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 520516, "Crypto": 800, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 523396, "Crypto": 800, "Allowance": 200}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 528630, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 533916, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 539255, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 544648, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 550094, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 585596, "Crypto": 800, "Allowance": 450}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"ARS": 585596, "Crypto": 1150, "Allowance": 450}, note:"" }
  ]},
  { id:141, name:"LAURA ALVAREZ", team:"", activeFrom:"2012-03-23", activeTo:"", area:"KiTS", supervisor:"MARIANA PAVON", notes:[], dni:"29.698.756", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1450}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1450, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 1600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Canada": 1600, "Healthcare": 120}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 1600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Canada": 1600, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:84, name:"ELIANA ARREGUI", team:"", activeFrom:"2014-10-20", activeTo:"", area:"Admin", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 146023}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 175970}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 196110}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 206798}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 204985}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 230177}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 262877}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 324173}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 372001}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 419829}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 900, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 150}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 150}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:238, name:"PETER DIAZ", team:"", activeFrom:"2007-05-11", activeTo:"", area:"KiTS", supervisor:"", notes:[], dni:"39.292.177", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 183810}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 195000, "Cash2": 200}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 213757, "Cash2": 200}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 239724, "Cash2": 200}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 251104, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 249984, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 275750, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 292100, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 308450, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 378157, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 433950, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 489743, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 600173, "Cash2": 200}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 688419, "Cash2": 200}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 776665, "Cash2": 200}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 872577, "Cash2": 200}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 905027, "Cash2": 200}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 934231, "Cash2": 200}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 960191, "Cash2": 200}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 986351, "Cash2": 200}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1008381, "Cash2": 500}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1022041, "Cash2": 500}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1037372, "Cash2": 500}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1048170, "Cash2": 500}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1055411, "Cash2": 500}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1107900, "Cash2": 500}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1123470, "Cash2": 500}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1129230, "Cash2": 500}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1140522, "Cash2": 500}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1151928, "Cash2": 500}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1163447, "Cash2": 500}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1175081, "Cash2": 500}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1186832, "Cash2": 500}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1258700, "Cash2": 500}, note:"" }
  ]},
  { id:277, name:"VICTORIA ROLON", team:"", activeFrom:"2021-01-06", activeTo:"", area:"KiTS", supervisor:"", notes:[], dni:"95.514.878", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 133839}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 160000}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"Canada": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 150, "Allowance": 150}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"Crypto": 1650, "Healthcare": 150}, note:"" }
  ]},
  { id:77, name:"DELFINA LUISSI", team:"", activeFrom:"2025-07-05", activeTo:"", area:"KiTS", supervisor:"", notes:[], dni:"41.023.642", address:"", personalEmail:"",
    history:[
    { from:"2025-05-01", rank:"", payments:{"Canada": 450}, note:"" }
  ]},
  { id:247, name:"ROBIN OLIVAS", team:"Data Creation Management", activeFrom:"2022-03-01", activeTo:"", area:"DATA CREATION", supervisor:"SERGIO ZILBERMAN", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 300, "Cash2": 200}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 100, "Cash2": 200}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 100}, note:"" },
    { from:"2026-02-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 100, "Cash2": 200}, note:"" },
    { from:"2026-03-01", rank:"Data Creation Manager", payments:{"Crypto": 1100, "Healthcare": 150, "Allowance": 100, "Cash2": 200}, note:"" }
  ]},
  { id:216, name:"MIRANDA GORDON", team:"Data Creation Management", activeFrom:"2024-09-12", activeTo:"", area:"DATA CREATION", supervisor:"ROBIN OLIVAS", notes:[], dni:"41.646.185", address:"", personalEmail:"",
    history:[
    { from:"2024-12-01", rank:"", payments:{"Crypto": 780, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 780, "Healthcare": 150, "Allowance": 50}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 780, "Healthcare": 150, "Allowance": 100}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 200}, note:"" },
    { from:"2026-01-01", rank:"Data Creation Analyst", payments:{"Crypto": 780, "Healthcare": 150, "Allowance": 100}, note:"" }
  ]},
  { id:110, name:"FRANCO LASIC", team:"Data Creation Management", activeFrom:"2023-07-17", activeTo:"", area:"DATA CREATION", supervisor:"ROBIN OLIVAS", notes:[], dni:"38.285.350", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"ARS": 263650}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 280000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2025-04-01", rank:"Data Creation Analyst", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:88, name:"ENRIQUE LOBBE", team:"Data Creation Management", activeFrom:"2023-08-05", activeTo:"", area:"DATA CREATION", supervisor:"ROBIN OLIVAS", notes:[], dni:"42.145.826", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 130}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"Data Creation Analyst", payments:{"Crypto": 750, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:171, name:"MARI VELASCO", team:"", activeFrom:"2025-04-01", activeTo:"", area:"Admin", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1200, "Allowance": 150}, note:"" }
  ]},
  { id:265, name:"SOFIA VINARO", team:"", activeFrom:"2023-01-01", activeTo:"", area:"ORDENANZA", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 52817}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 81960}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 86050}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 84900}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 97200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 105500}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 113675}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 144959}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 167890}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 190821}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 245411}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 279768}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 333656}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 376611}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 392836}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 407438}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 420418}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 433418}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 444418}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 451248}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 458017}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 463416}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 466987}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 492731}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 500516}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 503396}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 505913}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 510972}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 513527}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 516094}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 521255}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 556468}, note:"" }
  ]},
  { id:22, name:"ANDRES PORRES", team:"", activeFrom:"2023-01-01", activeTo:"", area:"ORDENANZA", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 100000}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 130000}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 150000}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 165000}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 180000}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 200000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 230000}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 290000}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 350000}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 500000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 525000}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 548625}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 570260}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 594500}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 609362}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 624596}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 633215}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 640932}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 659640}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 666237}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 672900}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 679629}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 686425}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 693290}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 700223}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 707225}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 767225}, note:"" }
  ]},
  { id:101, name:"FERNANDO RUIZ", team:"", activeFrom:"2007-01-11", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"ARS": 331821}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 380778}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 429735}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 559772}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 641226}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 722680}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 818591}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 851041}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 880246}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 906206}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 932366}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 954396}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 968056}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 982577}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 993375}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1000517}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1009039}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1068576}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1074336}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1085079}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1095930}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1106889}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1117958}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1129138}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1200423}, note:"" }
  ]},
  { id:89, name:"ERIC HIGA", team:"", activeFrom:"2008-01-03", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"38.137.948", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Healthcare": 100}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"Canada": 1700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 2500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 2500, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 3000, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 3000, "Healthcare": 150}, note:"" }
  ]},
  { id:87, name:"EMILIANO TORRES", team:"", activeFrom:"2016-01-08", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"38.612.127", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:63, name:"CRISTIAN WIKINSKY", team:"", activeFrom:"2018-01-05", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 900, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 180}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 900, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:111, name:"GERMAN SORZOLI", team:"", activeFrom:"2016-01-10", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 134435}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 151131}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 164982}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 184700, "Cash2": 70}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 195190, "Cash2": 70}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 193180, "Cash2": 70}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 218208, "Cash2": 70}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 231858, "Cash2": 70}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 245508, "Cash2": 70}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 308739, "Cash2": 70}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 354290, "Cash2": 70}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 399841, "Cash2": 70}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 516341, "Cash2": 70}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 597794, "Cash2": 70}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 679247, "Cash2": 70}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 775158, "Cash2": 70}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 807608, "Cash2": 70}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 836813, "Cash2": 70}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 862773, "Cash2": 70}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 888933, "Cash2": 70}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 910963, "Cash2": 70}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 924623, "Cash2": 70}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 938492, "Cash2": 70}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 949290, "Cash2": 70}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 956432, "Cash2": 70}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1008921, "Cash2": 70}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1024491, "Cash2": 70}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1030251, "Cash2": 70}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1040554, "Cash2": 70}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1050959, "Cash2": 70}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1061469, "Cash2": 70}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1072084, "Cash2": 70}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1082805, "Cash2": 70}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1153633, "Cash2": 70}, note:"" }
  ]},
  { id:143, name:"LAUTARO IBORRA", team:"", activeFrom:"2021-01-03", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"45.825.128", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 123527}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 140223}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 154074}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 171655, "Cash2": 30}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 181955, "Cash2": 30}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 179945, "Cash2": 30}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 194251, "Cash2": 30}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 207901, "Cash2": 30}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 221551, "Cash2": 30}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 276015, "Cash2": 30}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 316738, "Cash2": 30}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 357461, "Cash2": 30}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 471349, "Cash2": 30}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 545704, "Cash2": 30}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 623783, "Cash2": 30}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 713298, "Cash2": 30}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 745748, "Cash2": 30}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 774953, "Cash2": 30}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 800913, "Cash2": 30}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 827073, "Cash2": 30}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 849103, "Cash2": 30}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 862763, "Cash2": 30}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 875704, "Cash2": 30}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 886502, "Cash2": 30}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 893644, "Cash2": 30}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 946133, "Cash2": 30}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 961703, "Cash2": 30}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 967463, "Cash2": 30}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 977138, "Cash2": 30}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 986909, "Cash2": 30}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 996779, "Cash2": 30}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1006746, "Cash2": 30}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1016814, "Cash2": 30}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1086982, "Cash2": 30}, note:"" }
  ]},
  { id:99, name:"FERNANDO ALOI", team:"", activeFrom:"2021-01-10", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"ARS": 176260, "Cash2": 70}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 186254, "Cash2": 70}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 800, "Healthcare": 100, "Cash2": 70}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:79, name:"DENISE HIGA", team:"", activeFrom:"2022-01-08", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 88495}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 105191}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 119042}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 134457, "Cash2": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 143354, "Cash2": 100}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 141344, "Cash2": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 153644, "Cash2": 100}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 167294, "Cash2": 100}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 180944, "Cash2": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 180944, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 160}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:128, name:"JAVIER LAIRIHON", team:"", activeFrom:"2023-03-04", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"39.906.727", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:48, name:"CARLOS IAN MACKIE", team:"", activeFrom:"2023-06-26", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-07-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:134, name:"JONATHAN ODRIOZOLA", team:"", activeFrom:"2023-02-08", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"ARS": 309905}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 355628}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:274, name:"TOMAS URIEL HIGA", team:"", activeFrom:"2026-01-01", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"", payments:{"Crypto": 350, "Healthcare": 150}, note:"" }
  ]},
  { id:85, name:"ELVIS NAVA", team:"", activeFrom:"2024-06-01", activeTo:"", area:"DEVELOPERS", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-06-01", rank:"", payments:{"Crypto": 4000}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 4300}, note:"" }
  ]},
  { id:261, name:"SERGIO ZILBERMAN", team:"", activeFrom:"2004-02-15", activeTo:"", area:"MANAGEMENT", supervisor:"", notes:[], dni:"20.636.068", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"ARS": 200480}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 222843}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 233432}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 231520}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 256631}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 270281}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 283931}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 350630}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 402362}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 454094}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 650000}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 800000}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 881463}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 981262}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 1013712}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 1042917}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 1078877}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 1105037}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1127067}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1140727}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1157838}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1168636}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1175778}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1228267}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1243837}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1249597}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1302093}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1355114}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1368665}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1462752}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1477379}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1552152}, note:"" }
  ]},
  { id:92, name:"EZEQUIEL STOLAR", team:"", activeFrom:"2023-08-01", activeTo:"", area:"Admin", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"ARS": 1152000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 1400000}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 1520000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 1720000}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 1570000}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 1912000}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 1751000}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"ARS": 1818300}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 2314000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 2501700}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 2697800}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 2467200}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 2304000}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 2214800}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 2257200}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 2516800}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 2554600}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 2568800}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 2423200}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 2412800}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 2485600}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 2986800}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 3043800}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 3249000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 3294600}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 3237600}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 4377600}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"ARS": 4321600}, note:"" },
    { from:"2026-02-01", rank:"", payments:{"ARS": 4144000}, note:"" },
    { from:"2026-03-01", rank:"", payments:{"ARS": 4158800}, note:"" }
  ]},
  { id:29, name:"ARIEL STOLAR", team:"", activeFrom:"2023-08-01", activeTo:"", area:"Admin", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"ARS": 576000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 700000}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 760000}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 860000}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 792000}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 956000}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 875500}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"ARS": 909150}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 1157000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 1250850}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 1348900}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 1233600}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 1152000}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1107400}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1128600}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1258400}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1277300}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1284400}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1211600}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 1206400}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1242800}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1493400}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1521900}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1624500}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1647300}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1618800}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 2188800}, note:"" },
    { from:"2026-01-01", rank:"", payments:{"ARS": 2160800}, note:"" },
    { from:"2026-02-01", rank:"", payments:{"ARS": 2072000}, note:"" },
    { from:"2026-03-01", rank:"", payments:{"ARS": 2079400}, note:"" }
  ]},
  { id:161, name:"LUCY MILKES", team:"", activeFrom:"2023-05-01", activeTo:"", area:"MANAGEMENT", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"ARS": 187160}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 211825}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 237244}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 255000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 274125}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 328950}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 373360}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 423760}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 550888}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 647850}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 761870}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 825265}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 966038}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 1004680}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1047378}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1081417}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1108417}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1155478}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1167055}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1201120}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1225263}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1249890}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1262389}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1287763}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1300640}, note:"" }
  ]},
  { id:269, name:"SUSANA SEIBACH", team:"", activeFrom:"2023-05-01", activeTo:"", area:"MANAGEMENT", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"ARS": 187160}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 211825}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 237244}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 255000}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 274125}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 328950}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 373360}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 423760}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 550888}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 647850}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 761870}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 825265}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 966038}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 1004680}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 1047378}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 1081417}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 1108417}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 1155478}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 1167055}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 1201120}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1225263}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1249890}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1262389}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1287763}, note:"" },
    { from:"2025-12-01", rank:"", payments:{"ARS": 1300640}, note:"" }
  ]},
  { id:197, name:"MATEO LANIADO", team:"", activeFrom:"2026-03-03", activeTo:"2026-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2026-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150}, note:"" }
  ]},
  { id:248, name:"ROCIO MENENDEZ", team:"", activeFrom:"2025-09-02", activeTo:"2026-01-31", area:"", supervisor:"", notes:[], dni:"38.442.946", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"", payments:{"Crypto": 750, "Healthcare": 150}, note:"" }
  ]},
  { id:118, name:"GUILLERMO SALAS", team:"", activeFrom:"2025-10-20", activeTo:"2026-01-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-10-01", rank:"", payments:{"ARS": 1300000}, note:"" }
  ]},
  { id:201, name:"MATIAS RODRIGO NAVARRO", team:"", activeFrom:"2026-01-19", activeTo:"2026-01-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2026-01-01", rank:"", payments:{"Crypto": 850, "Healthcare": 150}, note:"" }
  ]},
  { id:241, name:"PILAR GIUDICE", team:"", activeFrom:"2025-03-25", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"41.668.299", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"ARS": 950000}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1000000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1100000}, note:"" }
  ]},
  { id:270, name:"TERESA SPAGNUOLO LOPEZ", team:"", activeFrom:"2025-07-28", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"ARS": 900000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1000000}, note:"" }
  ]},
  { id:70, name:"DANIELA NASRALA", team:"", activeFrom:"2025-05-08", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-09-01", rank:"", payments:{"ARS": 1100000}, note:"" }
  ]},
  { id:206, name:"MAXIMO SPADETTO", team:"", activeFrom:"2025-01-12", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"44.362.023", address:"", personalEmail:"",
    history:[
    { from:"2025-11-01", rank:"", payments:{"ARS": 1400000}, note:"" }
  ]},
  { id:196, name:"MATEO GAUTE", team:"", activeFrom:"2025-02-17", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-02-01", rank:"", payments:{"ARS": 940000}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"ARS": 1000000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1100000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1200000}, note:"" }
  ]},
  { id:130, name:"JENNIFFER BELTRAN", team:"", activeFrom:"2025-07-07", activeTo:"2025-12-31", area:"", supervisor:"", notes:[], dni:"37.035.488", address:"", personalEmail:"",
    history:[
    { from:"2025-06-01", rank:"", payments:{"ARS": 1300000}, note:"" }
  ]},
  { id:132, name:"JOAQUIN GHIRONI", team:"", activeFrom:"2025-07-04", activeTo:"2025-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"ARS": 950000}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 1000000}, note:"" },
    { from:"2025-11-01", rank:"", payments:{"ARS": 1100000}, note:"" }
  ]},
  { id:263, name:"SOFIA CASTALDI", team:"", activeFrom:"2024-12-08", activeTo:"2025-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:62, name:"CONSTANZA THOURTE", team:"", activeFrom:"2024-07-10", activeTo:"2025-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 720, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 720, "Healthcare": 150, "Allowance": 120}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 720, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:3, name:"AGOSTINA RAPOSO", team:"", activeFrom:"2025-07-21", activeTo:"2025-10-31", area:"", supervisor:"", notes:[], dni:"39.924.469", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150}, note:"" }
  ]},
  { id:276, name:"VICTORIA BAMBY", team:"", activeFrom:"2025-05-05", activeTo:"2025-10-31", area:"", supervisor:"", notes:[], dni:"95.514.878", address:"", personalEmail:"",
    history:[
    { from:"2025-05-01", rank:"", payments:{"ARS": 950000}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"ARS": 950000, "Healthcare": 150}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1000000}, note:"" },
    { from:"2025-10-01", rank:"", payments:{"ARS": 1080000}, note:"" }
  ]},
  { id:30, name:"AXEL MEIJOME", team:"", activeFrom:"2025-05-19", activeTo:"2025-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-05-01", rank:"", payments:{"ARS": 1230000}, note:"" },
    { from:"2025-09-01", rank:"", payments:{"ARS": 1350000}, note:"" }
  ]},
  { id:202, name:"MATIAS VARGAS SANCHEZ", team:"", activeFrom:"2025-08-18", activeTo:"2025-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-08-01", rank:"", payments:{"ARS": 1230000}, note:"" }
  ]},
  { id:49, name:"CARMINA MILLAN CASTILLO", team:"", activeFrom:"2024-01-06", activeTo:"2025-09-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-05-01", rank:"", payments:{"Canada": 1800}, note:"" }
  ]},
  { id:280, name:"YENNY SANTIAGO", team:"", activeFrom:"2025-07-07", activeTo:"2025-09-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"ARS": 1200000}, note:"" }
  ]},
  { id:195, name:"MARTINA VARGAS DURAND", team:"", activeFrom:"2024-01-29", activeTo:"2025-09-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-01-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Canada": 1100, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Canada": 1100, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Canada": 1100, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:91, name:"EUGENIA DERIANE", team:"", activeFrom:"2022-07-25", activeTo:"2025-08-31", area:"", supervisor:"", notes:[], dni:"35.885.854", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:26, name:"ANTONIO GUTIERREZ", team:"", activeFrom:"2023-01-11", activeTo:"2025-08-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"Crypto": 850, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:148, name:"LOURDES FUNES", team:"", activeFrom:"2024-07-22", activeTo:"2025-08-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-07-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100, "Allowance": 80}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 400, "Healthcare": 120, "Allowance": 80}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 400, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 400, "Healthcare": 150, "Allowance": 200}, note:"" },
    { from:"2025-07-01", rank:"", payments:{"Crypto": 450, "Healthcare": 150, "Allowance": 200}, note:"" }
  ]},
  { id:9, name:"AGUSTINA TOMASUCH", team:"", activeFrom:"2024-09-09", activeTo:"2025-08-31", area:"", supervisor:"", notes:[], dni:"42.471.203", address:"", personalEmail:"",
    history:[
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 500, "Healthcare": 150, "Allowance": 250}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:224, name:"NICOLAS MARINO", team:"", activeFrom:"2025-07-04", activeTo:"2025-08-31", area:"", supervisor:"", notes:[], dni:"39.757.308", address:"", personalEmail:"",
    history:[
    { from:"2025-02-01", rank:"", payments:{"ARS": 950000}, note:"" },
    { from:"2025-08-01", rank:"", payments:{"ARS": 1000000}, note:"" }
  ]},
  { id:278, name:"VICTORIA VAZQUEZ", team:"", activeFrom:"2024-03-04", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"95.514.878", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:267, name:"STEFANIA CASTRO GRAPSAS", team:"", activeFrom:"2024-05-20", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-05-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:52, name:"CATALINA NUÑEZ", team:"", activeFrom:"2025-07-21", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"39.560.883", address:"", personalEmail:"",
    history:[
    { from:"2025-07-01", rank:"", payments:{"ARS": 1000000}, note:"" }
  ]},
  { id:66, name:"DAIANA CIVITILLO", team:"", activeFrom:"2022-03-28", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 750}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 850, "Healthcare": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 900, "Healthcare": 100}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1300, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:136, name:"JUAN ERNESTO RIOS BALZA", team:"", activeFrom:"2022-03-01", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:167, name:"MALENA ISABEL DEFINA", team:"", activeFrom:"2023-03-07", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 650, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:200, name:"MATIAS GORDON", team:"", activeFrom:"2025-05-05", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"35.854.752", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"ARS": 950000}, note:"" }
  ]},
  { id:82, name:"EDEER JOSE ROSAS PEREZ", team:"", activeFrom:"2024-06-05", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200, "Healthcare": 100}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 150, "Allowance": 150}, note:"" }
  ]},
  { id:236, name:"PEDRO ALABART", team:"", activeFrom:"2023-05-09", activeTo:"2025-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 550, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 550, "Healthcare": 120, "Allowance": 110}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 800, "Healthcare": 120, "Allowance": 110}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 800, "Healthcare": 150, "Allowance": 200}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 1000, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:83, name:"EDGAR RUIZ", team:"", activeFrom:"2025-10-01", activeTo:"2025-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-02-01", rank:"", payments:{"Canada": 2000}, note:"" }
  ]},
  { id:16, name:"ANA TSCHUBAROV", team:"", activeFrom:"2024-06-24", activeTo:"2025-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:150, name:"LUCAS RODRIGUEZ MARCHIARO", team:"", activeFrom:"2024-09-12", activeTo:"2025-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 120}, note:"" },
    { from:"2025-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 120}, note:"" }
  ]},
  { id:95, name:"FACUNDO MOCHI", team:"", activeFrom:"2024-05-02", activeTo:"2025-06-30", area:"", supervisor:"", notes:[], dni:"41.646.185", address:"", personalEmail:"",
    history:[
    { from:"2024-01-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 300}, note:"" }
  ]},
  { id:207, name:"MELINA SZTEJN", team:"", activeFrom:"2025-07-04", activeTo:"2025-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-04-01", rank:"", payments:{"Crypto": 700, "Healthcare": 150, "Allowance": 150}, note:"Pasa a Crypto — antes Monotributo" }
  ]},
  { id:155, name:"LUCIA MUNNO", team:"", activeFrom:"2021-12-04", activeTo:"2025-05-31", area:"", supervisor:"", notes:[], dni:"40.004.795", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939, "Cash2": 200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035, "Cash2": 200}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 200}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 200}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 211139, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"ARS": 227489, "Cash2": 200}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"ARS": 243839, "Cash2": 200}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"ARS": 294311, "Cash2": 200}, note:"" },
    { from:"2023-11-01", rank:"", payments:{"ARS": 337733, "Cash2": 200}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"ARS": 381155, "Cash2": 200}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"ARS": 492214, "Cash2": 200}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"ARS": 569860, "Cash2": 200}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"ARS": 647507, "Cash2": 200}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"ARS": 647507, "Cash2": 300}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"ARS": 742980, "Cash2": 300}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"ARS": 779318, "Cash2": 300}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"ARS": 808523, "Cash2": 300}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"ARS": 834483, "Cash2": 300}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"ARS": 868928, "Cash2": 300}, note:"" },
    { from:"2024-10-01", rank:"", payments:{"ARS": 882677, "Cash2": 300}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"ARS": 896337, "Cash2": 500}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"ARS": 909782, "Cash2": 500}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"ARS": 920580, "Cash2": 500}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"ARS": 927722, "Cash2": 500}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"ARS": 980211, "Cash2": 500}, note:"" },
    { from:"2025-05-01", rank:"", payments:{"ARS": 995781, "Cash2": 500}, note:"" }
  ]},
  { id:256, name:"SARAH MAKAREM", team:"", activeFrom:"2023-08-21", activeTo:"2025-05-31", area:"", supervisor:"", notes:[], dni:"95.918.464", address:"", personalEmail:"",
    history:[
    { from:"2023-08-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-01-01", rank:"", payments:{"Canada": 350, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" },
    { from:"2025-04-01", rank:"", payments:{"Crypto": 600, "Healthcare": 150, "Allowance": 250}, note:"" }
  ]},
  { id:61, name:"CONSTANZA FERREIRO", team:"", activeFrom:"2025-07-04", activeTo:"2025-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2025-02-01", rank:"", payments:{"ARS": 500000}, note:"" }
  ]},
  { id:47, name:"CARLA VENDITTI", team:"", activeFrom:"2014-07-15", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"42.155.544", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1500, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 200}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 1800, "Healthcare": 120, "Allowance": 1200}, note:"" }
  ]},
  { id:186, name:"MARIANA RANGEL", team:"", activeFrom:"2021-06-09", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"39.353.215", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Canada": 850, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Canada": 850, "Healthcare": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Canada": 850, "Healthcare": 120, "Allowance": 120}, note:"" }
  ]},
  { id:264, name:"SOFIA MAZZINI", team:"", activeFrom:"2022-05-09", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" }
  ]},
  { id:165, name:"MAGDALENA VILA MELO", team:"", activeFrom:"2024-06-05", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 200}, note:"" }
  ]},
  { id:237, name:"PEDRO HAUCHAR", team:"", activeFrom:"2024-07-22", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-07-01", rank:"", payments:{"Crypto": 300, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 350, "Healthcare": 100, "Allowance": 70}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 400, "Healthcare": 120, "Allowance": 80}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 400, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2025-02-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 120}, note:"" }
  ]},
  { id:227, name:"NORBERTO ECHEVARRIA", team:"", activeFrom:"2023-12-19", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-12-01", rank:"", payments:{"Canada": 1400, "Healthcare": 100, "Cash2": 500}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 100, "Cash2": 500}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 1400, "Healthcare": 120, "Cash2": 500}, note:"" }
  ]},
  { id:57, name:"CECILIA RAVASI", team:"", activeFrom:"2022-07-25", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"96.022.101", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-11-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120}, note:"" }
  ]},
  { id:172, name:"MARI VELASQUEZ", team:"", activeFrom:"2023-07-01", activeTo:"2025-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-07-01", rank:"", payments:{"Canada": 1000}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 1200}, note:"" }
  ]},
  { id:55, name:"CECILIA BARCAT", team:"", activeFrom:"2022-12-19", activeTo:"2025-01-31", area:"", supervisor:"", notes:[], dni:"96.022.101", address:"", personalEmail:"",
    history:[
    { from:"2023-02-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Allowance": 355}, note:"" }
  ]},
  { id:41, name:"CAMILA KOZMAN", team:"", activeFrom:"2023-06-02", activeTo:"2025-01-31", area:"", supervisor:"", notes:[], dni:"40.731.632", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 140}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 700, "Healthcare": 120, "Allowance": 200}, note:"" }
  ]},
  { id:8, name:"AGUSTINA RICCI", team:"", activeFrom:"2024-11-03", activeTo:"2025-01-31", area:"", supervisor:"", notes:[], dni:"42.471.203", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 250}, note:"" },
    { from:"2025-01-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 250}, note:"" }
  ]},
  { id:170, name:"MARCOS CIGNOLA PENACCA", team:"", activeFrom:"2024-05-02", activeTo:"2025-01-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-01-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 400, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120, "Allowance": 100}, note:"" },
    { from:"2024-12-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 150}, note:"" }
  ]},
  { id:10, name:"ALEJANDRO GRECO", team:"", activeFrom:"2025-01-27", activeTo:"2025-01-31", area:"", supervisor:"", notes:[], dni:"96.015.060", address:"", personalEmail:"",
    history:[
    { from:"2025-01-01", rank:"", payments:{"Crypto": 500, "Healthcare": 120}, note:"" }
  ]},
  { id:93, name:"EZEQUIEL YOEL SZTAJN", team:"", activeFrom:"2022-03-28", activeTo:"2024-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 800, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 900, "Healthcare": 120, "Allowance": 180}, note:"" }
  ]},
  { id:106, name:"FLORENCIA SALADDINO CARUSI", team:"", activeFrom:"2023-11-21", activeTo:"2024-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-11-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 550, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" }
  ]},
  { id:163, name:"LUNA ROCCO", team:"", activeFrom:"2024-11-03", activeTo:"2024-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 600, "Healthcare": 120, "Allowance": 120}, note:"" }
  ]},
  { id:100, name:"FERNANDO GABRIEL MENA", team:"", activeFrom:"2023-03-01", activeTo:"2024-11-30", area:"SALES SUPPORT", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 120000}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 135050}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 750, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 850, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 850, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 850, "Healthcare": 120, "Allowance": 170}, note:"" }
  ]},
  { id:34, name:"BERNARDITA BONACCORSO", team:"", activeFrom:"2023-02-05", activeTo:"2024-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 650, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" }
  ]},
  { id:209, name:"MELISA RACHEL WILK", team:"", activeFrom:"2024-11-03", activeTo:"2024-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" },
    { from:"2024-08-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 94}, note:"" }
  ]},
  { id:228, name:"OLIVIA ABRAHAM", team:"", activeFrom:"2024-04-11", activeTo:"2024-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-10-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:176, name:"MARIA FE BELLIDO", team:"", activeFrom:"2022-07-12", activeTo:"2024-10-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" },
    { from:"2024-07-01", rank:"", payments:{"Crypto": 650, "Healthcare": 100}, note:"" },
    { from:"2024-09-01", rank:"", payments:{"Crypto": 650, "Healthcare": 120}, note:"" }
  ]},
  { id:33, name:"BELEN FASINELLI", team:"", activeFrom:"2024-09-09", activeTo:"2024-10-31", area:"", supervisor:"", notes:[], dni:"38.992.441", address:"", personalEmail:"",
    history:[
    { from:"2024-09-01", rank:"", payments:{"Crypto": 350, "Healthcare": 100}, note:"" }
  ]},
  { id:220, name:"NAYRA ROSA CONTRERAS HUBER", team:"", activeFrom:"2024-02-19", activeTo:"2024-08-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-02-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-05-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:249, name:"RODRIGO MARTINEZ", team:"", activeFrom:"2024-07-15", activeTo:"2024-07-31", area:"", supervisor:"", notes:[], dni:"30.436.672", address:"", personalEmail:"",
    history:[
    { from:"2024-07-01", rank:"", payments:{"Crypto": 500}, note:"" }
  ]},
  { id:115, name:"GREGORIO ROJAS", team:"", activeFrom:"2022-01-11", activeTo:"2024-06-30", area:"", supervisor:"", notes:[], dni:"40.635.065", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 700, "Healthcare": 100}, note:"" }
  ]},
  { id:182, name:"MARIA VICTORIA HEREDIA", team:"", activeFrom:"2024-03-07", activeTo:"2024-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:127, name:"JAMMY JAVIER DIAZ", team:"", activeFrom:"2023-06-02", activeTo:"2024-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2024-06-01", rank:"", payments:{"Crypto": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:164, name:"MAGDALENA MUÑIZ", team:"", activeFrom:"2022-05-16", activeTo:"2024-05-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"" }
  ]},
  { id:177, name:"MARIA JOSE GARCIA", team:"", activeFrom:"2023-06-21", activeTo:"2024-05-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 700}, note:"" },
    { from:"2023-10-01", rank:"", payments:{"Canada": 700, "Healthcare": 100}, note:"" }
  ]},
  { id:43, name:"CANDELARIA OCHOA", team:"", activeFrom:"2023-11-13", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" }
  ]},
  { id:102, name:"FIORELLA ZAMBRANO", team:"", activeFrom:"2022-12-19", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:129, name:"JENIREE MEDINA SIU", team:"", activeFrom:"2023-01-11", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-11-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" }
  ]},
  { id:208, name:"MELISA LEUNDA", team:"", activeFrom:"2024-03-01", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-12-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-04-01", rank:"", payments:{"Canada": 350, "Healthcare": 100}, note:"" }
  ]},
  { id:140, name:"JULIETA LIVA", team:"", activeFrom:"2024-11-03", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"40.675.842", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 350}, note:"" }
  ]},
  { id:189, name:"MARIANO AMEZCUA", team:"", activeFrom:"2024-04-22", activeTo:"2024-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:191, name:"MARINA ARDENGO", team:"", activeFrom:"2023-02-05", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:187, name:"MARIANELLA FARIAS", team:"", activeFrom:"2023-01-11", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"Canada": 400}, note:"" }
  ]},
  { id:214, name:"MILAGROS LOPEZ", team:"", activeFrom:"2023-11-13", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"95.956.861", address:"", personalEmail:"",
    history:[
    { from:"2023-11-01", rank:"", payments:{"Canada": 350}, note:"" },
    { from:"2024-03-01", rank:"", payments:{"Canada": 350, "Healthcare": 100}, note:"" }
  ]},
  { id:98, name:"FELIPE OJEDA", team:"", activeFrom:"2022-12-19", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:166, name:"MAIRA PINETTA", team:"", activeFrom:"2024-01-04", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2024-03-01", rank:"", payments:{"Canada": 400}, note:"" }
  ]},
  { id:250, name:"ROMAN CABRERA ARIAS", team:"", activeFrom:"2019-06-05", activeTo:"2024-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 1300}, note:"" }
  ]},
  { id:7, name:"AGUSTINA MIGNONE", team:"", activeFrom:"2023-02-05", activeTo:"2024-02-29", area:"", supervisor:"", notes:[], dni:"42.471.203", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-09-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:20, name:"ANDREA ANGULO", team:"", activeFrom:"2022-08-22", activeTo:"2024-02-29", area:"", supervisor:"", notes:[], dni:"30.436.672", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:272, name:"TOMAS RODRIGUEZ", team:"", activeFrom:"2023-01-03", activeTo:"2024-02-29", area:"", supervisor:"", notes:[], dni:"40.395.689", address:"", personalEmail:"",
    history:[
    { from:"2023-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 450, "Healthcare": 100}, note:"" }
  ]},
  { id:169, name:"MANUEL OJEDA", team:"", activeFrom:"2023-01-03", activeTo:"2024-02-29", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-03-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 450, "Healthcare": 100}, note:"" }
  ]},
  { id:173, name:"MARIA AZUL MALAGA", team:"", activeFrom:"2023-01-11", activeTo:"2024-02-29", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"Canada": 400}, note:"" },
    { from:"2024-02-01", rank:"", payments:{"Canada": 400, "Healthcare": 100}, note:"" }
  ]},
  { id:257, name:"SEBASTIAN BENZONI", team:"", activeFrom:"2023-04-17", activeTo:"2024-01-31", area:"", supervisor:"", notes:[], dni:"38.456.416", address:"", personalEmail:"",
    history:[
    { from:"2023-04-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-12-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:183, name:"MARIA DE LOS MILAGROS BOGADO", team:"", activeFrom:"2021-12-04", activeTo:"2023-12-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 130939, "Cash2": 200}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 147035, "Cash2": 200}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 160886, "Cash2": 200}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"ARS": 178750, "Cash2": 200}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"ARS": 188844, "Cash2": 200}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"ARS": 186438, "Cash2": 200}, note:"" },
    { from:"2023-07-01", rank:"", payments:{"ARS": 211139, "Cash2": 200}, note:"" },
    { from:"2023-08-01", rank:"", payments:{"Canada": 800, "Healthcare": 100}, note:"Pasa a Crypto — antes relación de dependencia" }
  ]},
  { id:1, name:"ADRIANA GUEDEZ", team:"", activeFrom:"2022-12-19", activeTo:"2023-11-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:36, name:"BIANCA RIOS", team:"", activeFrom:"2023-01-11", activeTo:"2023-10-31", area:"", supervisor:"", notes:[], dni:"38.993.306", address:"", personalEmail:"",
    history:[
    { from:"2023-10-01", rank:"", payments:{"Canada": 400}, note:"" }
  ]},
  { id:46, name:"CARLA SABRINA VALDEZ", team:"", activeFrom:"2023-05-07", activeTo:"2023-09-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:32, name:"BARBARA HORENSTEIN", team:"", activeFrom:"2009-04-06", activeTo:"2023-08-31", area:"", supervisor:"", notes:[], dni:"36.400.748", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 2200}, note:"" }
  ]},
  { id:103, name:"FLORENCIA GOTTARDO", team:"", activeFrom:"2023-03-07", activeTo:"2023-08-31", area:"", supervisor:"", notes:[], dni:"41.894.638", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:138, name:"JUANA MORENO", team:"", activeFrom:"2022-05-12", activeTo:"2023-08-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-04-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" }
  ]},
  { id:11, name:"ALEJO MUJICA", team:"", activeFrom:"2022-07-11", activeTo:"2023-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"Canada": 500, "Healthcare": 100}, note:"" },
    { from:"2023-05-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:158, name:"LUCIANO GANCEDO", team:"", activeFrom:"2023-03-07", activeTo:"2023-07-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-07-01", rank:"", payments:{"Canada": 400}, note:"" }
  ]},
  { id:113, name:"GONZALO GANCEDO", team:"", activeFrom:"2023-03-07", activeTo:"2023-06-30", area:"", supervisor:"", notes:[], dni:"45.819.609", address:"", personalEmail:"",
    history:[
    { from:"2023-06-01", rank:"", payments:{"Canada": 400}, note:"" }
  ]},
  { id:133, name:"JOAQUIN QUIJANO", team:"", activeFrom:"2023-01-02", activeTo:"2023-06-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" },
    { from:"2023-06-01", rank:"", payments:{"Canada": 600, "Healthcare": 100}, note:"" }
  ]},
  { id:123, name:"IARA BACHA IZAGUIRRE", team:"", activeFrom:"2023-02-13", activeTo:"2023-05-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:50, name:"CATALINA FIORI", team:"", activeFrom:"2023-05-15", activeTo:"2023-05-31", area:"", supervisor:"", notes:[], dni:"39.560.883", address:"", personalEmail:"",
    history:[
    { from:"2023-05-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:64, name:"CRISTINA PALAVECINO", team:"", activeFrom:"2023-06-02", activeTo:"2023-04-30", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" }
  ]},
  { id:240, name:"PILAR CASTRO", team:"", activeFrom:"2021-01-12", activeTo:"2023-03-31", area:"", supervisor:"", notes:[], dni:"41.668.299", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 107095}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 137042}, note:"" }
  ]},
  { id:254, name:"SANTIAGO MOLE", team:"", activeFrom:"2023-02-03", activeTo:"2023-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-03-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:80, name:"DIEGO FERNANDO BASSI", team:"", activeFrom:"2022-12-12", activeTo:"2023-03-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:121, name:"HUGO ALOI", team:"", activeFrom:"2021-01-10", activeTo:"2023-03-31", area:"", supervisor:"", notes:[], dni:"508454", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"ARS": 127945}, note:"" },
    { from:"2023-02-01", rank:"", payments:{"ARS": 144641}, note:"" },
    { from:"2023-03-01", rank:"", payments:{"ARS": 158492}, note:"" }
  ]},
  { id:147, name:"LOURDES CHAVEZ", team:"", activeFrom:"2023-09-01", activeTo:"2023-02-28", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
  { id:255, name:"SANTIAGO MOLES", team:"", activeFrom:"2022-09-26", activeTo:"2023-01-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 600}, note:"" }
  ]},
  { id:221, name:"NAZARENA BERENICE GUILLOTI", team:"", activeFrom:"2022-05-12", activeTo:"2023-01-31", area:"", supervisor:"", notes:[], dni:"", address:"", personalEmail:"",
    history:[
    { from:"2023-01-01", rank:"", payments:{"Canada": 500}, note:"" }
  ]},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function mkey(y, m) {
  return y + "-" + String(m + 1).padStart(2, "0");
}

function isActiveInMonth(emp, y, m) {
  const first = mkey(y, m) + "-01";
  const last  = mkey(y, m) + "-31";
  if (emp.activeFrom > last) return false;
  // Inactive only if activeTo is in a PREVIOUS month (still active throughout activeTo's month)
  if (emp.activeTo) {
    const parts = emp.activeTo.split("-");
    const ay = parseInt(parts[0], 10);
    const am = parseInt(parts[1], 10);
    if (ay < y || (ay === y && am < m + 1)) return false;
  }
  return true;
}

function snapshotAt(emp, dateStr) {
  const sorted = [...emp.history].sort((a, b) => a.from.localeCompare(b.from));
  let snap = sorted[0];
  for (const s of sorted) { if (s.from <= dateStr) snap = s; }
  return snap;
}

function toARS(pay, d) {
  let t = 0;
  if (pay.ARS)        t += pay.ARS;
  if (pay.Crypto)     t += pay.Crypto     * d;
  if (pay.Canada)     t += pay.Canada     * d;
  if (pay.Healthcare) t += pay.Healthcare * d;
  if (pay.Allowance)  t += pay.Allowance  * d;
  if (pay.Cash2)      t += pay.Cash2      * d;
  if (pay.Bonus)      t += pay.Bonus      * d;
  if (pay.Mono)       t += pay.Mono;
  return t;
}

// Costo real empleador: aplica carga social solo sobre componente ARS
function toCosto(pay, d, cargaPct) {
  let t = 0;
  if (pay.ARS)        t += pay.ARS * (1 + cargaPct / 100);
  if (pay.Crypto)     t += pay.Crypto     * d;
  if (pay.Canada)     t += pay.Canada     * d;
  if (pay.Healthcare) t += pay.Healthcare * d;
  if (pay.Allowance)  t += pay.Allowance  * d;
  if (pay.Cash2)      t += pay.Cash2      * d;
  if (pay.Bonus)      t += pay.Bonus      * d;
  if (pay.Mono)       t += pay.Mono;
  return t;
}

const fARS = n => new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(n);
const fUSD = n => "U$ " + new Intl.NumberFormat("es-AR", { maximumFractionDigits:0 }).format(n);
const initials = n => n.split(" ").map(x => x[0]).join("").substring(0, 2).toUpperCase();
const avatarColor = id => AVATAR_COLORS[id % AVATAR_COLORS.length];
const rankColor = (rank, ranks) => { const i = ranks.indexOf(rank); return i >= 0 ? RANK_COLORS[i % RANK_COLORS.length] : "bg-gray-100 text-gray-600"; };
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const fDateLong = d => {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length === 3) return parts[2].padStart(2,"0") + " " + MONTHS_ES[parseInt(parts[1],10)-1] + " " + parts[0];
  return d;
};
const fDate = d => {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length === 3) return parts[2] + "/" + parts[1] + "/" + parts[0];
  if (parts.length === 2) return parts[1] + "/" + parts[0];
  return d;
};

// ── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function DateInput({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => {
    if (value) { const [y,m] = value.split("-"); return { year: +y, month: +m - 1 }; }
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toDisplay = v => {
    if (!v) return "";
    const [y,m,d] = v.split("-");
    return `${d}/${m}/${y}`;
  };
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DAYS = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];
  const firstDay = new Date(view.year, view.month, 1).getDay(); // 0=Sun
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1); // Mon-based
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const selDay = value ? +value.split("-")[2] : null;
  const selMon = value ? +value.split("-")[1] - 1 : null;
  const selYear = value ? +value.split("-")[0] : null;
  const prevMonth = () => setView(v => v.month === 0 ? {year: v.year-1, month: 11} : {year: v.year, month: v.month-1});
  const nextMonth = () => setView(v => v.month === 11 ? {year: v.year+1, month: 0} : {year: v.year, month: v.month+1});
  const pick = d => {
    if (!d) return;
    const mm = String(view.month+1).padStart(2,"0");
    const dd = String(d).padStart(2,"0");
    onChange(`${view.year}-${mm}-${dd}`);
    setOpen(false);
  };
  return (
    <div className="relative w-full" ref={ref}>
      <button type="button"
        onClick={() => setOpen(o => !o)}
        className={className + " w-full flex items-center justify-between bg-white cursor-pointer text-left"}
        style={{minHeight:"38px"}}>
        <span className={value ? "text-gray-800 text-sm" : "text-gray-400 text-sm"}>
          {value ? toDisplay(value) : "dd/mm/aaaa"}
        </span>
        <span className="text-gray-400 text-sm ml-2">📅</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 p-2" style={{left:0, top:"100%", width:"168px"}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <button type="button" onClick={prevMonth} className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">‹</button>
            <span className="text-xs font-bold text-gray-800">{MONTHS[view.month].slice(0,3)} {view.year}</span>
            <button type="button" onClick={nextMonth} className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">›</button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-0.5">
            {DAYS.map(d => <div key={d} className="text-center font-bold text-gray-400 py-0.5" style={{fontSize:"9px"}}>{d}</div>)}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const isSelected = d && d === selDay && view.month === selMon && view.year === selYear;
              const isToday = d && new Date().getDate() === d && new Date().getMonth() === view.month && new Date().getFullYear() === view.year;
              return (
                <button key={i} type="button" onClick={() => pick(d)}
                  disabled={!d}
                  className={"w-5 h-5 rounded text-center flex items-center justify-center mx-auto transition-colors " +
                    (isSelected ? "text-white font-bold" :
                     isToday ? "font-bold border border-green-400 text-green-700" :
                     d ? "text-gray-700 hover:bg-gray-100" : "")
                  }
                  style={{fontSize:"10px", ...(isSelected ? {background:"#0a4a3a"} : {})}}>
                  {d || ""}
                </button>
              );
            })}
          </div>
          {/* Clear */}
          {value && (
            <div className="mt-1 pt-1 border-t border-gray-100 text-center">
              <button type="button" onClick={() => { onChange(""); setOpen(false); }}
                className="text-gray-400 hover:text-red-500" style={{fontSize:"10px"}}>× Limpiar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef();
  const prevOptions = useRef(options);
  if (prevOptions.current !== options) {
    prevOptions.current = options;
    if (open) setOpen(false);
  }
  const filtered = options.filter(opt => opt !== "All" && opt.toLowerCase().includes(q.toLowerCase()));
  function handleOpen() { setOpen(o => !o); setQ(""); setTimeout(() => inputRef.current?.focus(), 50); }
  return (
    <div className="relative">
      <button type="button" onClick={handleOpen}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-300">
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <span className="text-gray-400 text-xs ml-2">{open ? "^" : "v"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl">
          <div className="p-2 border-b border-gray-100">
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="Buscar..." autoComplete="off"
              className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
          </div>
          <div className="max-h-48 overflow-y-auto">
            <button type="button" onClick={() => { onChange("All"); setOpen(false); setQ(""); }}
              className={"w-full text-left px-3 py-2 text-sm hover:bg-gray-50 " + (!value ? "bg-gray-50 text-gray-500 font-semibold" : "text-gray-400")}>
              {placeholder}
            </button>
            {filtered.map(opt => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setQ(""); }}
                className={"w-full text-left px-3 py-2 text-sm hover:bg-blue-50 " + (value === opt ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700")}>
                {opt}
              </button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-3 text-xs text-gray-400 text-center">Sin resultados</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function Toast({ msg, type }) {
  return (
    <div className={"fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold " + (type === "warn" ? "bg-amber-500" : "bg-emerald-600")}>
      {msg}
    </div>
  );
}

// ── PRINT PREVIEW ─────────────────────────────────────────────────────────────
function PrintPreview({ emp, dolarMap, ipcMap, ranks, chartData, year, month, rangeFrom, rangeTo, onClose }) {
  const printRef = useRef();
  const sorted = [...emp.history].sort((a, b) => a.from.localeCompare(b.from));
  const now = new Date();
  const today = now.toLocaleDateString("es-AR");

  // Use selected period
  const selectedKey = mkey(year, month);
  const current = sorted.filter(s => s.from.slice(0,7) <= selectedKey).slice(-1)[0]
                  || sorted[sorted.length - 1];
  const currentDolar = dolarMap[selectedKey] || 1420;
  const currentTotal = current ? toARS(current.payments, currentDolar) : 0;
  const periodLabel = MONTHS[month] + " " + year;

  // Age at selected period
  const selectedDate = new Date(year, month, 1);
  const ageMonths = Math.max(0, Math.floor((selectedDate - new Date(emp.activeFrom)) / (1000 * 60 * 60 * 24 * 30)));

  // Snapshots within the selected range
  const effectiveFrom = rangeFrom || sorted[0]?.from?.slice(0,7) || "";
  const effectiveTo   = rangeTo   || selectedKey;
  const snapsUpToPeriod = sorted.filter(s => s.from.slice(0,7) <= selectedKey);
  const snapsInRange    = sorted.filter(s => s.from.slice(0,7) >= effectiveFrom && s.from.slice(0,7) <= effectiveTo);

  // Variation: from start of range to end of range
  let varTotal = null;
  let varLabel = "";
  if (snapsInRange.length >= 2) {
    const s0 = snapsInRange[0];
    const sN = snapsInRange[snapsInRange.length - 1];
    const k0 = mkey(new Date(s0.from).getFullYear(), new Date(s0.from).getMonth());
    const kN = mkey(new Date(sN.from).getFullYear(), new Date(sN.from).getMonth());
    const d0Blue = dolarMap[k0] || 1420;
    const dNBlue = dolarMap[kN] || 1420;
    const d0Crypto = dolarCryptoMap[k0] || d0Blue;
    const dNCrypto = dolarCryptoMap[kN] || dNBlue;
    const first = useCrypto ? toARSProfile(s0.payments, d0Blue, d0Crypto) : toARS(s0.payments, d0Blue);
    const last  = useCrypto ? toARSProfile(sN.payments, dNBlue, dNCrypto) : toARS(sN.payments, dNBlue);
    if (first > 0) {
      varTotal = ((last - first) / first) * 100;
      varLabel = s0.from.slice(0,7) + " → " + sN.from.slice(0,7);
    }
  }

  // IPC acumulado del rango
  let ipcAcum = null;
  if (ipcMap && Object.keys(ipcMap).length > 0 && effectiveFrom && effectiveTo) {
    let factor = 1;
    let cur = new Date(effectiveFrom + "-01");
    const end = new Date(effectiveTo + "-01");
    while (cur <= end) {
      const k = mkey(cur.getFullYear(), cur.getMonth());
      if (ipcMap[k] != null) factor *= (1 + ipcMap[k] / 100);
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }
    ipcAcum = (factor - 1) * 100;
  }

  function handlePrint() {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const w = window.open("", "_blank");
    if (!w) { alert("Por favor permitir popups para imprimir"); return; }
    w.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>" +
      "@page{margin:15mm;size:A4}" +
      "*{box-sizing:border-box;font-family:Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;max-width:100%}" +
      "body{margin:0;padding:16px;font-size:11px;color:#111;overflow-x:hidden}" +
      "</style></head><body>" + content + "</body></html>");
    w.document.close();
    w.onload = () => { w.focus(); w.print(); w.close(); };
    setTimeout(() => { try { w.focus(); w.print(); } catch(e){} }, 800);
  }

  const maxARS = Math.max(...chartData.map(p => p.ars), 1);
  const barSample = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 18)) === 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: "700px", maxWidth: "100%", maxHeight: "92vh" }}>

        {/* toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <div>
            <div className="font-bold text-gray-800 text-sm">Vista previa — {emp.name}</div>
            <div className="text-xs text-gray-400">{effectiveFrom} → {effectiveTo} · {today}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700">
              Imprimir / PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-lg">x</button>
          </div>
        </div>

        {/* scrollable preview */}
        <div className="overflow-y-auto flex-1 bg-gray-100 p-4">
          <div ref={printRef} style={{ background: "white", padding: "24px", borderRadius: "8px", fontFamily: "Arial,sans-serif", fontSize: "11px", color: "#111" }}>

            {/* header */}
            <div style={{ background: "#1f2937", color: "white", padding: "16px 20px", borderRadius: "8px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900, marginBottom: "3px" }}>{emp.name}</div>
                <div style={{ color: "#9ca3af", fontSize: "11px" }}>Equipo: {emp.team}</div>
                <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>Desde {fDate(emp.activeFrom)}{emp.activeTo ? " · hasta " + fDate(emp.activeTo) : ""}</div>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, display: "inline-block", marginTop: "6px" }}>{current && current.rank}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#9ca3af", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px" }}>Sueldo — {periodLabel}</div>
                <div style={{ fontSize: "20px", fontWeight: 900 }}>{fARS(currentTotal)}</div>
                <div style={{ color: "#9ca3af", fontSize: "10px" }}>{fUSD(currentDolar > 0 ? currentTotal / currentDolar : 0)}</div>
                <div style={{ color: "#6b7280", fontSize: "9px", marginTop: "6px" }}>KiSP Nomina · {periodLabel}</div>
              </div>
            </div>

            {/* stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "Periodos registrados", val: sorted.length, sub: sorted.length > 1 ? (sorted.length - 1) + " cambio(s)" : "Sin cambios" },
                { label: "Antiguedad", val: (Math.floor(ageMonths/12) > 0 ? Math.floor(ageMonths/12) + "a " : "") + (ageMonths%12) + "m", sub: "desde " + fDate(emp.activeFrom) },
                { label: "Variacion salarial", val: varTotal != null ? (varTotal > 0 ? "+" : "") + varTotal.toFixed(1) + "%" : "—", sub: varLabel, color: varTotal != null ? (varTotal > 0 ? "#15803d" : "#b91c1c") : undefined },
                ...(ipcAcum != null ? [
                  { label: "IPC acumulado", val: "+" + ipcAcum.toFixed(1) + "%", sub: effectiveFrom + " → " + effectiveTo, color: "#c2410c" },
                  { label: "Variacion real", val: varTotal != null ? ((varTotal - ipcAcum) >= 0 ? "+" : "") + (varTotal - ipcAcum).toFixed(1) + "%" : "—", sub: "salario vs inflacion", color: varTotal != null ? ((varTotal - ipcAcum) >= 0 ? "#15803d" : "#b91c1c") : undefined },
                ] : []),
              ].map(s => (
                <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "3px" }}>{s.label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: s.color || "#111" }}>{s.val}</div>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* chart bars */}
            {chartData.length > 2 && (
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Evolucion salarial (ARS)</div>
                <div style={{ display: "flex", alignItems: "flex-end", height: "70px", gap: "2px", borderBottom: "1px solid #e5e7eb" }}>
                  {barSample.map((p, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ background: "#3b82f6", width: "100%", height: Math.max(2, (p.ars / maxARS) * 66) + "px", borderRadius: "2px 2px 0 0" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                  {barSample.map((p, i) => (
                    <div key={i} style={{ flex: 1, fontSize: "7px", color: "#9ca3af", textAlign: "center", overflow: "hidden" }}>{p.label}</div>
                  ))}
                </div>
              </div>
            )}

            {/* history table */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Historial de cambios</div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      {["Periodo", "Cargo", "Composicion salarial", "Total ARS", "Variacion"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: h === "Total ARS" || h === "Variacion" ? "right" : "left", fontSize: "9px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {snapsInRange.map((snap, i) => {
                      const isLast = i === snapsInRange.length - 1;
                      const next = snapsInRange[i + 1];
                      const sd = new Date(snap.from);
                      const dk = mkey(sd.getFullYear(), sd.getMonth());
                      const d = dolarMap[dk] || 1420;
                      const arsTotal = toARS(snap.payments, d);
                      let pct = null;
                      if (i > 0) {
                        const prev = snapsInRange[i - 1];
                        const pd2 = new Date(prev.from);
                        const pk = mkey(pd2.getFullYear(), pd2.getMonth());
                        const pd = dolarMap[pk] || 1420;
                        const prevTotal = toARS(prev.payments, pd);
                        if (prevTotal > 0) pct = ((arsTotal - prevTotal) / prevTotal) * 100;
                      }
                      const period = next ? fDate(snap.from) + " - " + fDate(next.from) : fDate(snap.from) + " - Actual";
                      return (
                        <tr key={i} style={{ background: isLast ? "#eff6ff" : "white", borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "8px 10px", fontSize: "9px", color: "#6b7280", verticalAlign: "top" }}>
                            <div>{period}</div>
                            {snap.note && <div style={{ fontStyle: "italic", color: "#9ca3af", marginTop: "2px" }}>{snap.note}</div>}
                          </td>
                          <td style={{ padding: "8px 10px", verticalAlign: "top" }}>
                            <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 600 }}>{snap.rank}</span>
                            {isLast && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 600, marginLeft: "3px" }}>Actual</span>}
                          </td>
                          <td style={{ padding: "8px 10px", verticalAlign: "top" }}>
                            {PAYMENT_TYPES.filter(pt => snap.payments[pt] > 0).map(pt => {
                              const meta = PAYMENT_META[pt];
                              const val = snap.payments[pt];
                              const label = pt === "ARS" ? fARS(val) : "U$ " + val.toLocaleString("es-AR");
                              return <span key={pt} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 6px", borderRadius: "12px", fontSize: "9px", display: "inline-block", margin: "1px" }}>{label}</span>;
                            })}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, fontSize: "11px", whiteSpace: "nowrap", verticalAlign: "top" }}>{fARS(arsTotal)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", verticalAlign: "top" }}>
                            {pct != null
                              ? <span style={{ background: pct > 0 ? "#dcfce7" : "#fee2e2", color: pct > 0 ? "#15803d" : "#b91c1c", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 700 }}>{pct > 0 ? "+" : ""}{pct.toFixed(1)}%</span>
                              : <span style={{ color: "#9ca3af", fontSize: "9px" }}>Ingreso</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* footer */}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", display: "flex", justifyContent: "space-between", color: "#9ca3af", fontSize: "9px" }}>
              <span>KiSP Nomina — Historial salarial confidencial</span>
              <span>Generado el {today}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EMPLOYEE PROFILE MODAL ────────────────────────────────────────────────────
function toARSProfile(pay, dBlue, dCrypto) {
  // Healthcare y Allowance siguen la tasa del troncal
  const trunkIsCrypto = (pay.Crypto || 0) > 0;
  const dSupp = trunkIsCrypto ? dCrypto : dBlue;
  let t = 0;
  if (pay.ARS)        t += pay.ARS;
  if (pay.Crypto)     t += pay.Crypto     * dCrypto;
  if (pay.Canada)     t += pay.Canada     * dBlue;
  if (pay.Healthcare) t += pay.Healthcare * dSupp;
  if (pay.Allowance)  t += pay.Allowance  * dSupp;
  if (pay.Cash2)      t += pay.Cash2      * dBlue;
  if (pay.Bonus)      t += pay.Bonus      * dBlue;
  if (pay.Mono)       t += pay.Mono;
  return t;
}

function EmployeeProfile({ emp, dolarMap, dolarCryptoMap, ipcMap, ranks, onClose, onSaveHistory, onSaveNotes, onPrint }) {
  const [addingNote, setAddingNote] = useState(false);
  const [useCrypto, setUseCrypto] = useState(false);
  const [newNote, setNewNote] = useState({ text: "", reminder: "" });

  const [showNoteHistory, setShowNoteHistory] = useState(false);

  const activeNotes = useMemo(() => [...(emp.notes || [])].filter(n => n.active !== false).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [emp.notes]);
  const inactiveNotes = useMemo(() => [...(emp.notes || [])].filter(n => n.active === false).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [emp.notes]);

  function saveNote() {
    if (!newNote.text.trim()) return;
    const note = { id: Date.now(), text: newNote.text.trim(), reminder: newNote.reminder, createdAt: new Date().toISOString().slice(0,10), active: true };
    onSaveNotes(emp.id, [...(emp.notes || []), note]);
    setNewNote({ text: "", reminder: "" });
    setAddingNote(false);
  }

  function deleteNote(id) {
    onSaveNotes(emp.id, (emp.notes || []).filter(n => n.id !== id));
  }

  function deactivateNote(id) {
    onSaveNotes(emp.id, (emp.notes || []).map(n => n.id === id ? { ...n, active: false, reminder: "" } : n));
  }

  function reactivateNote(id) {
    onSaveNotes(emp.id, (emp.notes || []).map(n => n.id === id ? { ...n, active: true } : n));
  }

  function clearReminder(id) {
    onSaveNotes(emp.id, (emp.notes || []).map(n => n.id === id ? { ...n, reminder: "" } : n));
  }

  const sorted = useMemo(() => [...emp.history].sort((a, b) => a.from.localeCompare(b.from)), [emp.history]);

  // Range filter - default: last 24 months
  const defaultFrom = useMemo(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 24);
    return d.toISOString().slice(0, 7);
  }, []);
  const firstMonth = useMemo(() => sorted[0]?.from?.slice(0, 7) || "2023-01", [sorted]);
  const [rangeFrom, setRangeFrom] = useState(defaultFrom);
  const [rangeTo, setRangeTo]     = useState(() => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + 1); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); });

  const chartData = useMemo(() => {
    const pts = [];
    const start = new Date(rangeFrom + "-01");
    const end   = new Date(rangeTo   + "-28");
    const empEnd = emp.activeTo ? new Date(emp.activeTo) : new Date();
    const actualEnd = end < empEnd ? end : empEnd;
    let cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= actualEnd) {
      const y = cur.getFullYear(), m = cur.getMonth();
      const k = mkey(y, m);
      const dBlue = dolarMap[k] || 0;
      const dCrypto = dolarCryptoMap[k] || dBlue;
      const snap = snapshotAt(emp, k + "-15");
      if (snap) pts.push({ label: MONTHS_SHORT[m] + " " + y, key: k, ars: useCrypto ? toARSProfile(snap.payments, dBlue, dCrypto) : toARS(snap.payments, dBlue) });
      cur = new Date(y, m + 1, 1);
    }
    return pts;
  }, [emp, dolarMap, dolarCryptoMap, rangeFrom, rangeTo, useCrypto]);

  const filteredHistory = useMemo(() =>
    sorted.filter(s => s.from.slice(0,7) >= rangeFrom && s.from.slice(0,7) <= rangeTo)
  , [sorted, rangeFrom, rangeTo]);

  const changeKeys = useMemo(() =>
    filteredHistory.slice(1).map(s => { const d = new Date(s.from); return mkey(d.getFullYear(), d.getMonth()); })
  , [filteredHistory]);

  const current = sorted[sorted.length - 1];
  const nowKey = mkey(new Date().getFullYear(), new Date().getMonth());
  const currentDolar = dolarMap[nowKey] || 1420;
  const currentDolarCrypto = dolarCryptoMap[nowKey] || currentDolar;
  const currentTotal = current ? (useCrypto ? toARSProfile(current.payments, currentDolar, currentDolarCrypto) : toARS(current.payments, currentDolar)) : 0;

  function deleteSnap(idx) {
    if (sorted.length <= 1) return;
    onSaveHistory(emp.id, emp.history.filter((_, j) => j !== idx));
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50" style={{alignItems: window.innerWidth < 500 ? "flex-end" : "center", padding: window.innerWidth < 500 ? "0" : "8px"}}>
      <div className="bg-white w-full max-w-3xl flex flex-col relative" style={{ maxHeight: window.innerWidth < 500 ? "95vh" : "92vh", borderRadius: window.innerWidth < 500 ? "20px 20px 0 0" : "16px", marginLeft: window.innerWidth < 500 ? 0 : "8px", marginRight: window.innerWidth < 500 ? 0 : "8px" }}>

        {/* Botón cerrar SIEMPRE visible arriba a la derecha */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold shadow-sm">×</button>

        {/* header */}
        <div className="p-4 pr-14 border-b border-gray-200 flex items-start gap-3 shrink-0">
          <div className={"w-11 h-11 " + avatarColor(emp.id) + " rounded-2xl flex items-center justify-center text-white text-base font-bold shrink-0"}>
            {initials(emp.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-black text-gray-900 truncate">{emp.name}</div>
            <div className="text-xs text-gray-500">{emp.team}</div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {emp.area && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{emp.area}</span>}
              <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + rankColor(current && current.rank, ranks)}>{current && current.rank}</span>
              <span className="text-xs text-gray-400">desde {fDate(emp.activeFrom)}</span>
              {current?.payments?.Crypto > 0 && (
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold ml-1">
                  <button type="button" onClick={() => setUseCrypto(false)}
                    className={"px-2 py-0.5 transition-colors " + (!useCrypto ? "bg-blue-600 text-white" : "bg-white text-gray-400 hover:bg-gray-50")}>Blue</button>
                  <button type="button" onClick={() => setUseCrypto(true)}
                    className={"px-2 py-0.5 transition-colors " + (useCrypto ? "bg-purple-600 text-white" : "bg-white text-gray-400 hover:bg-gray-50")}>Crypto</button>
                </div>
              )}
            </div>
            {(emp.dni || emp.address) && (
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {emp.dni && <span className="text-xs text-gray-500">🪪 <span className="font-mono">{emp.dni}</span></span>}
                {emp.address && <span className="text-xs text-gray-500">📍 {emp.address}</span>}
                {emp.personalEmail && <span className="text-xs text-gray-500">✉️ {emp.personalEmail}</span>}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Sueldo</div>
            <div className="text-base font-black text-gray-900">{fARS(currentTotal)}</div>
            <div className="text-xs text-gray-400">{fUSD(currentDolar > 0 ? currentTotal / currentDolar : 0)}</div>
            <button onClick={() => onPrint(emp, chartData, rangeFrom, rangeTo)} className="mt-1 flex items-center gap-1 px-2 py-1 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-700">
              <span>PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* range selector */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0">Periodo</span>
            <div className="flex items-center gap-2 flex-1">
              <input type="month" value={rangeFrom} min={firstMonth} max={rangeTo}
                onChange={e => setRangeFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <span className="text-gray-400 text-sm">—</span>
              <input type="month" value={rangeTo} min={rangeFrom}
                onChange={e => setRangeTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div className="flex gap-1">
              {[["6m","6 meses",6],["1a","1 año",12],["2a","2 años",24],["Todo","Todo",null]].map(([label, title, months]) => (
                <button key={label} onClick={() => {
                  if (months === null) { setRangeFrom(firstMonth); setRangeTo(new Date().toISOString().slice(0,7)); }
                  else { const d = new Date(); d.setMonth(d.getMonth() - months); setRangeFrom(d.toISOString().slice(0,7)); setRangeTo(new Date().toISOString().slice(0,7)); }
                }} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* chart */}
          {chartData.length > 1 && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-3">Evolucion salarial (ARS)</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={Math.floor(chartData.length / 6)} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v >= 1000000 ? "$" + (v / 1000000).toFixed(1) + "M" : "$" + (v / 1000).toFixed(0) + "K"} />
                  <Tooltip formatter={v => fARS(v)} labelStyle={{ fontWeight: 700 }} />
                  {changeKeys.map(k => {
                    const idx = chartData.findIndex(p => p.key === k);
                    if (idx < 0) return null;
                    return <ReferenceLine key={k} x={chartData[idx].label} stroke="#6366f1" strokeDasharray="4 2" strokeWidth={1.5} />;
                  })}
                  <Line type="monotone" dataKey="ars" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── NOTES ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900">📝 Notas</span>
                {activeNotes.length > 0 && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{activeNotes.length}</span>}
              </div>
              <button onClick={() => setAddingNote(v => !v)}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-700">
                + Agregar nota
              </button>
            </div>

            {addingNote && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-3 space-y-2">
                <textarea rows={3} placeholder="Escribí tu nota aquí..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                  value={newNote.text} onChange={e => setNewNote(p => ({ ...p, text: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase shrink-0">Reminder</label>
                  <input type="month" className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    value={newNote.reminder} onChange={e => setNewNote(p => ({ ...p, reminder: e.target.value }))} />
                  <span className="text-xs text-gray-400">(opcional)</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setAddingNote(false); setNewNote({ text: "", reminder: "" }); }}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">Cancelar</button>
                  <button onClick={saveNote} disabled={!newNote.text.trim()}
                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 disabled:opacity-40">Guardar</button>
                </div>
              </div>
            )}

            {activeNotes.length === 0 && !addingNote && (
              <div className="text-center py-6 text-gray-400 text-sm">Sin notas activas</div>
            )}

            <div className="space-y-2">
              {activeNotes.map(note => {
                const today = new Date().toISOString().slice(0,7);
                const hasReminder = !!note.reminder;
                const isPending = hasReminder && note.reminder >= today;
                const isOverdue = hasReminder && note.reminder < today;
                return (
                  <div key={note.id} className={"rounded-xl border p-3 group " + (isPending ? "bg-amber-50 border-amber-200" : isOverdue ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 flex-1 whitespace-pre-wrap">{note.text}</p>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                        <button onClick={() => deactivateNote(note.id)} title="Archivar nota"
                          className="text-gray-400 hover:text-gray-600 text-xs px-1.5 py-0.5 rounded border border-gray-200 hover:border-gray-400 bg-white">
                          Archivar
                        </button>
                        <button onClick={() => deleteNote(note.id)} title="Borrar permanentemente"
                          className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">
                          🗑
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">{note.createdAt}</span>
                      {hasReminder ? (
                        <span className={"inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full " + (isPending ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                          {isOverdue ? "⚠️ Vencido" : "🔔"} {MONTHS[parseInt(note.reminder.slice(5,7))-1]} {note.reminder.slice(0,4)}
                          <button onClick={() => clearReminder(note.id)} className="ml-0.5 hover:opacity-60 font-black leading-none">×</button>
                        </span>
                      ) : (
                        <input type="month" title="Agregar reminder"
                          className="text-xs border border-dashed border-gray-300 rounded-full px-2 py-0.5 text-gray-400 focus:outline-none focus:border-amber-400 cursor-pointer"
                          onChange={e => { if(e.target.value) onSaveNotes(emp.id, (emp.notes||[]).map(n => n.id===note.id ? {...n, reminder:e.target.value} : n)); }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Historial de notas archivadas */}
            {inactiveNotes.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <button onClick={() => setShowNoteHistory(v => !v)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors">
                  <span>{showNoteHistory ? "▾" : "▸"}</span>
                  Historial archivadas ({inactiveNotes.length})
                </button>
                {showNoteHistory && (
                  <div className="mt-2 space-y-2">
                    {inactiveNotes.map(note => (
                      <div key={note.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 group opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-500 flex-1 whitespace-pre-wrap">{note.text}</p>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                            <button onClick={() => reactivateNote(note.id)} title="Restaurar nota"
                              className="text-green-500 hover:text-green-700 text-xs px-1.5 py-0.5 rounded border border-green-200 hover:border-green-400 bg-white">
                              Restaurar
                            </button>
                            <button onClick={() => deleteNote(note.id)} title="Borrar permanentemente"
                              className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">
                              🗑
                            </button>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{note.createdAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold text-gray-700">
                  Historial de cambios
                  {filteredHistory.length < sorted.length && <span className="ml-2 text-xs text-gray-400">({filteredHistory.length} de {sorted.length})</span>}
                </div>
                {(() => {
                  const fromKey = rangeFrom; // "YYYY-MM"
                  const toKey   = rangeTo;
                  const fdSnap = snapshotAt(emp, fromKey + "-15");
                  const tdSnap = snapshotAt(emp, toKey   + "-15");
                  if (!fdSnap || !tdSnap) return null;
                  const dFirstBlue = dolarMap[fromKey] || 1420;
                  const dLastBlue  = dolarMap[toKey]   || 1420;
                  const dFirstCrypto = dolarCryptoMap[fromKey] || dFirstBlue;
                  const dLastCrypto  = dolarCryptoMap[toKey]   || dLastBlue;
                  const totalFirst = useCrypto ? toARSProfile(fdSnap.payments, dFirstBlue, dFirstCrypto) : toARS(fdSnap.payments, dFirstBlue);
                  const totalLast  = useCrypto ? toARSProfile(tdSnap.payments, dLastBlue,  dLastCrypto)  : toARS(tdSnap.payments, dLastBlue);
                  if (totalFirst <= 0) return null;
                  const pct = ((totalLast - totalFirst) / totalFirst) * 100;
                  const color = pct >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
                  // IPC acumulado del rango
                  let ipcAcum = null;
                  if (ipcMap && Object.keys(ipcMap).length > 0) {
                    let factor = 1;
                    let cur = new Date(fromKey + "-01");
                    const end = new Date(toKey + "-01");
                    while (cur <= end) {
                      const k = mkey(cur.getFullYear(), cur.getMonth());
                      if (ipcMap[k] != null) factor *= (1 + ipcMap[k] / 100);
                      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
                    }
                    ipcAcum = (factor - 1) * 100;
                  }
                  return (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={"px-2.5 py-1 rounded-full text-xs font-bold " + color}>
                        Salario {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                      </span>
                      {ipcAcum != null && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                          IPC +{ipcAcum.toFixed(1)}%
                        </span>
                      )}
                      {ipcAcum != null && (
                        <span className={"px-2.5 py-1 rounded-full text-xs font-bold " + (pct - ipcAcum >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          Real {pct - ipcAcum >= 0 ? "+" : ""}{(pct - ipcAcum).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">No hay cambios en este periodo</div>
              )}
              {[...filteredHistory].reverse().map((snap, ri) => {
                const i = filteredHistory.length - 1 - ri;
                const isLast = snap === sorted[sorted.length - 1];
                const next = filteredHistory[i + 1];
                const sd = new Date(snap.from);
                const dk = mkey(sd.getFullYear(), sd.getMonth());
                const dBlue = dolarMap[dk] || 1420;
                const dCryptoSnap = dolarCryptoMap[dk] || dBlue;
                const arsTotal = useCrypto ? toARSProfile(snap.payments, dBlue, dCryptoSnap) : toARS(snap.payments, dBlue);
                const dLabel = useCrypto ? dCryptoSnap : dBlue;
                let pct = null;
                if (i > 0) {
                  const prev = filteredHistory[i - 1];
                  const pd2 = new Date(prev.from);
                  const pk = mkey(pd2.getFullYear(), pd2.getMonth());
                  const pdBlue = dolarMap[pk] || 1420;
                  const pdCrypto = dolarCryptoMap[pk] || pdBlue;
                  const prevTotal = useCrypto ? toARSProfile(prev.payments, pdBlue, pdCrypto) : toARS(prev.payments, pdBlue);
                  if (prevTotal > 0) pct = ((arsTotal - prevTotal) / prevTotal) * 100;
                }
                const prev = i > 0 ? filteredHistory[i - 1] : null;
                const diffLines = [];
                if (prev) {
                  if (snap.rank !== prev.rank) diffLines.push(`Cargo: ${prev.rank || "—"} → ${snap.rank || "—"}`);
                  const allKeys = new Set([...Object.keys(snap.payments || {}), ...Object.keys(prev.payments || {})]);
                  allKeys.forEach(pt => {
                    const oldVal = (prev.payments || {})[pt] || 0;
                    const newVal = (snap.payments || {})[pt] || 0;
                    if (oldVal === newVal) return;
                    const meta = PAYMENT_META[pt];
                    const lbl = meta ? meta.label : pt;
                    const pfx = (pt === "ARS" || pt === "Mono") ? "$" : "U$";
                    if (oldVal === 0) diffLines.push(`${lbl} agregado: ${pfx}${newVal}`);
                    else if (newVal === 0) diffLines.push(`${lbl} eliminado`);
                    else diffLines.push(`${lbl}: ${pfx}${oldVal} → ${pfx}${newVal}`);
                  });
                }
                return (
                  <div key={i} className="relative flex gap-4 pb-5">
                    <div className={"relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 " + (isLast ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300")}>
                      <span className={"text-xs font-black " + (isLast ? "text-white" : "text-gray-500")}>{i + 1}</span>
                    </div>
                    <div className={"flex-1 rounded-2xl border p-4 group " + (isLast ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200")}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input type="month" value={snap.from.slice(0,7)}
                              onChange={e => {
                                if (!e.target.value) return;
                                const newFrom = e.target.value + "-01";
                                onSaveHistory(emp.id, emp.history.map(s => s === snap ? { ...s, from: newFrom } : s));
                              }}
                              className="font-bold text-gray-800 text-sm border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 cursor-pointer" />
                            {next && <span className="text-gray-400 text-xs">→ {fDate(next.from)}</span>}
                            {isLast && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">Actual</span>}
                            <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + rankColor(snap.rank, ranks)}>{snap.rank}</span>
                          </div>
                          {snap.note && <div className="text-xs text-gray-500 mt-1 italic">{snap.note}</div>}
                          {diffLines.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {diffLines.map((l, di) => <div key={di} className="text-xs text-gray-400">{l}</div>)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {pct != null && (
                            <span className={"text-xs font-bold px-2 py-1 rounded-full " + (pct > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                              {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
                            </span>
                          )}
                          {emp.history.length > 1 && (
                            <button onClick={() => { if (window.confirm("¿Borrar esta entrada del historial?")) deleteSnap(sorted.indexOf(snap)); }} className="p-1 rounded hover:bg-red-50 text-red-400 text-xs border border-red-200">
                              × Borrar
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {PAYMENT_TYPES.filter(pt => snap.payments[pt] > 0).map(pt => {
                          const meta = PAYMENT_META[pt];
                          const cc = COLOR[meta.color];
                          const val = snap.payments[pt];
                          const label = pt === "ARS" ? fARS(val) : `U$ ${val.toLocaleString("es-AR")}`;
                          return <span key={pt} className={"px-2.5 py-1 rounded-full text-xs font-semibold border " + cc.badge + " " + cc.border}>{meta.label} {label}</span>;
                        })}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Total al dolar del periodo (${dLabel.toLocaleString("es-AR")})</span>
                        <span className="font-bold text-gray-800 text-sm">{fARS(arsTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [dolarMap, setDolarMap]   = useState(DOLAR_BLUE);
  const [ipcMap, setIpcMap]       = useState({});
  const [cargaSocial, setCargaSocial] = useState(50);
  const [cargaInput, setCargaInput]   = useState("50");
  const [teams, setTeams]         = useState(TEAMS_INIT);
  const [ranks, setRanks]         = useState(RANKS_INIT);
  const [areas, setAreas]         = useState(AREAS);

  const [year, setYear]           = useState(2026);
  const [month, setMonth]         = useState(2);
  const [view, setView]           = useState("nomina");
  const [payFilter, setPayFilter] = useState(null);
  const [teamFilter, setTeamFilter] = useState("All");
  const [cargoFilter, setCargoFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [supervisorFilter, setSupervisorFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [rankGroup, setRankGroup]         = useState("area");
  const [rankSort, setRankSort]           = useState("desc");
  const [sortField, setSortField]         = useState(null);
  const [rankAreaFilter, setRankAreaFilter] = useState("All");
  const [emailTemplates, setEmailTemplates] = useState({
    salesSupport: {
      to: "Antonella Rimoli <arimoli@kisptech.com>",
      cc: "Cristina Law <claw@kisp.com>",
      subject: "New Team Member Joining Sales Support — {name}",
      body: "Hi Antonella,\n\nI wanted to let you know that {name} will be joining the Sales Support team on {startDate}.\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    cad: {
      to: "Mariela Rico <mrico@kisptech.com>",
      cc: "Andrea Martinez <amartinez@kisptech.com>, Silvana Hetenyi <shetenyi@kisptech.com>",
      subject: "New Team Member Joining CAD — {name}",
      body: "Hi Mariela,\n\nI wanted to let you know that {name} will be joining the CAD team on {startDate}.\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    crypto: {
      to: "Mary Velasco <mvelasco@kisptech.com>",
      cc: "Eliana Arregui <earregui@kisp.com>, Robert Kendal <rkendal@kisp.com>",
      subject: "New Team Member with Crypto Payment — {name}",
      body: "Hi Mary,\n\nPlease find below the details for our new team member joining on {startDate}:\n\nFull Name: {name}\nDNI: {dni}\nAddress: {address}\nPersonal Email: {personalEmail}\nDepartment: {area}\nSalary: {salary}\nStart Date: {startDate}\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    monotributo: {
      to: "Ezequiel Stolar <ezequielstolar@gmail.com>",
      cc: "Mary Velasco <mvelasco@kisptech.com>, Robert Kendal <rkendal@kisp.com>",
      subject: "New Team Member — MONOTRIBUTO — {name}",
      body: "Hi Ezequiel,\n\nPlease find below the details for our new team member joining on {startDate}:\n\nFull Name: {name}\nDNI: {dni}\nAddress: {address}\nPersonal Email: {personalEmail}\nDepartment: {area}\nPayment Type: MONOTRIBUTO\nSalary: {arsNet}\nStart Date: {startDate}\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    dependencia: {
      to: "Ezequiel Stolar <ezequielstolar@gmail.com>",
      cc: "Mary Velasco <mvelasco@kisptech.com>, Robert Kendal <rkendal@kisp.com>",
      subject: "New Team Member — RELACION DE DEPENDENCIA — {name}",
      body: "Hi Ezequiel,\n\nPlease find below the details for our new team member joining on {startDate}:\n\nFull Name: {name}\nDNI: {dni}\nAddress: {address}\nPersonal Email: {personalEmail}\nDepartment: {area}\nPayment Type: RELACION DE DEPENDENCIA\nSalary: {arsNet}\nStart Date: {startDate}\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    cash2Change: {
      to: "Ezequiel Stolar <ezequielstolar@gmail.com>",
      cc: "Robert Kendal <rkendal@kisp.com>",
      subject: "Cash 2 Update — {name} · {monthYear}",
      body: "Hi Ezequiel,\n\nPlease be advised that as of {monthYear}, {name} will be receiving ${cash2Amount} as Cash 2.\n\nKindly process this accordingly.\n\nThank you!"
    },
    bonusChange: {
      to: "Ezequiel Stolar <ezequielstolar@gmail.com>",
      cc: "Robert Kendal <rkendal@kisp.com>",
      subject: "Bonus Update — {name} · {monthYear}",
      body: "Hi Ezequiel,\n\nPlease be advised that as of {monthYear}, {name} will be receiving a bonus of ${bonusAmount}.\n\nKindly process this accordingly.\n\nThank you!"
    },
    cryptoChange: {
      to: "Mary Velasco <mvelasco@kisptech.com>",
      cc: "Robert Kendal <rkendal@kisp.com>",
      subject: "Salary Update — {name} · {monthYear}",
      body: "Hi Mary,\n\nWe {changeDirection} {name}'s salary to ${cryptoAmount}\nPlease plan on paying the new salary effective {monthYear}\n\nThank you,"
    },
    canadaNew: {
      to: "Mary Velasco <mvelasco@kisptech.com>",
      cc: "Eliana Arregui <earregui@kisp.com>, Robert Kendal <rkendal@kisp.com>",
      subject: "New Team Member - Canada USD — {name}",
      body: "Hi Mary,\n\nPlease find below the details for our new team member joining on {startDate}:\n\nFull Name: {name}\nDNI: {dni}\nAddress: {address}\nPersonal Email: {personalEmail}\nDepartment: {area}\nSalary: {salary}\nStart Date: {startDate}\n\nCould you please reach out to coordinate their onboarding?\n\nThank you!"
    },
    cryptoToCanada: {
      to: "Mary Velasco <mvelasco@kisptech.com>",
      cc: "Robert Kendal <rkendal@kisp.com>",
      subject: "USD from Canada — {name} · {monthYear}",
      body: "Hi Mary,\n\nPlease be advised that effective {monthYear}, {name} will no longer be paid via USDT and will instead be paid from Canada, sending MONOTRIBUTO \"E\". Please give {himHer} all the details to proceed.\n\nKindly remove {himHer} from the USDT payment schedule and add {himHer} to the Canada USD payment list starting {monthYear}.\n\nThank you,"
    },
    resignation: {
      to: "Mary Velasco <mvelasco@kisptech.com>",
      cc: "",
      subject: "Resignation — {name}",
      body: "Hi Mary,\n\nI wanted to inform you that {name} has resigned from {hisHer} position, effective {endDate}.\n\nCould you please initiate and follow up on the offboarding process accordingly?\n\nThank you,"
    }
  });
  const [cmpA, setCmpA] = useState(null);
  const [draftNotification, setDraftNotification] = useState(null);
  const [pendingDrafts, setPendingDrafts] = useState([]);
  const [cmpB, setCmpB] = useState(null);
  const [cmpSearchA, setCmpSearchA] = useState("");
  const [cmpSearchB, setCmpSearchB] = useState("");
  const [rankTeamFilter, setRankTeamFilter] = useState("All");
  const [rankCargoFilter, setRankCargoFilter] = useState("All");
  const [editDolar, setEditDolar] = useState(false);
  const [dolarCryptoMap, setDolarCryptoMap] = useState({});
  const [editDolarCrypto, setEditDolarCrypto] = useState(false);
  const [useNominaCrypto, setUseNominaCrypto] = useState(() => localStorage.getItem("kisp-use-crypto") === null ? true : localStorage.getItem("kisp-use-crypto") === "true");
  useEffect(() => { localStorage.setItem("kisp-use-crypto", useNominaCrypto); }, [useNominaCrypto]);
  const [modal, setModal]         = useState(null);
  const [profileEmp, setProfileEmp] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [toast, setToast]         = useState(null);

  const key   = mkey(year, month);
  const dolar = dolarMap[key] || 0;
  const dolarCrypto = dolarCryptoMap[key] || 0;

  // ── ANNIVERSARY ALERTS: employees hitting 6m or 1y this month ──
  const anniversaryAlerts = useMemo(() => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1; // 1-based
    const alerts = [];
    employees.forEach(emp => {
      if (!emp.activeFrom || emp.activeTo) return; // skip inactive
      const start = new Date(emp.activeFrom);
      const startMonth = start.getMonth() + 1;
      const startYear = start.getFullYear();
      // calc total months of tenure
      const totalMonths = (thisYear - startYear) * 12 + (thisMonth - startMonth);
      if (totalMonths <= 0) return;
      // check if this month is a 6-month or 12-month (yearly) anniversary
      const is6months = totalMonths === 6;
      const is1year   = totalMonths === 12;
      if (is6months || is1year) {
        alerts.push({
          emp,
          totalMonths,
          label: is6months ? "🎉 6 meses" : "🏆 1 año",
          type: is1year ? "year" : "half",
        });
      }
    });
    return alerts.sort((a, b) => b.totalMonths - a.totalMonths);
  }, [employees]);

  // ── STORAGE: load on mount ──
  useEffect(() => {
    async function fetchIPC() {
      try {
        const res = await fetch("https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=48&sort=desc");
        if (res.ok) {
          const data = await res.json();
          const series = (data.data || []).slice().reverse(); // oldest first
          const map = {};
          for (let i = 1; i < series.length; i++) {
            const [dateStr, val] = series[i];
            const [, prevVal] = series[i - 1];
            const k = dateStr.slice(0, 7); // "YYYY-MM"
            map[k] = ((val - prevVal) / prevVal) * 100;
          }
          setIpcMap(map);
        }
      } catch (e) {
        console.log("No se pudo obtener IPC:", e);
      }
    }

    async function fetchDolarBlue() {
      try {
        const res = await fetch("https://dolarapi.com/v1/dolares/blue");
        if (res.ok) {
          const data = await res.json();
          if (data.compra) {
            const now = new Date();
            const k = mkey(now.getFullYear(), now.getMonth());
            setDolarMap(prev => ({ ...prev, [k]: data.compra }));
          }
        }
      } catch (e) {
        console.log("No se pudo obtener dolar blue:", e);
      }
      try {
        const res = await fetch("https://dolarapi.com/v1/dolares/cripto");
        if (res.ok) {
          const data = await res.json();
          if (data.compra) {
            const now = new Date();
            const k = mkey(now.getFullYear(), now.getMonth());
            setDolarCryptoMap(prev => ({ ...prev, [k]: data.compra }));
          }
        }
      } catch (e) {
        console.log("No se pudo obtener dolar cripto:", e);
      }
      // Cargar historico cripto
      try {
        const res = await fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares/cripto", { redirect: "follow" });
        if (res.ok) {
          const data = await res.json();
          // Agrupar por mes y promediar
          const byMonth = {};
          data.forEach(d => {
            const k = d.fecha.slice(0, 7).replace("-", "-").slice(0, 4) + "-" + d.fecha.slice(5, 7);
            if (!byMonth[k]) byMonth[k] = [];
            byMonth[k].push(d.compra);
          });
          const monthlyAvg = {};
          Object.entries(byMonth).forEach(([k, vals]) => {
            monthlyAvg[k] = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
          });
          setDolarCryptoMap(prev => ({ ...monthlyAvg, ...prev }));
        }
      } catch (e) {
        console.log("No se pudo obtener historico cripto:", e);
      }
    }

    async function loadFromStorage() {
      try {
        const res = await fetch(SHEETS_URL, { method: "GET", mode: "cors" });
        if (res.ok) {
          const data = await res.json();
          if (data.employees) {
            // Migrate v5: full bonus reset. Clear ALL bonus data for any employee below v5.
            const migratedEmployees = data.employees.map(e => {
              const history = (e.history || []).map(s => {
                const { Bonus, ...rest } = s.payments || {};
                return { ...s, payments: rest };
              });
              if ((e.bonusVersion || 0) < 5) {
                const { bonusAmount, bonusMonth, bonusHistory, bonusVersion, ...empRest } = e;
                return { ...empRest, bonusHistory: [], bonusVersion: 5, history };
              }
              // v5+ employees: strip root fields, keep bonusHistory
              const { bonusAmount, bonusMonth, ...empRest } = e;
              return { ...empRest, history };
            });
            setEmployees(migratedEmployees);
            if (data.dolarMap) setDolarMap(data.dolarMap);
            setStorageReady(true);
            fetchDolarBlue();
            fetchIPC();
            return;
          }
        }
        setLoadError(true);
        setStorageReady(true);
      } catch (e) {
        console.error("Error cargando desde Sheets:", e);
        setLoadError(true);
        setStorageReady(true);
      }
    }
    loadFromStorage();
  }, []);

  // ── STORAGE: save on change ──
  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwPX2og-NirPVsPNMLasWg3RPkyvGfJwUGcbOd9uPRK3QrrGuy7GgG90puNgDflCB4v/exec";

  useEffect(() => {
    if (!storageReady) return;
    // Guardar en localStorage inmediatamente
    try {
      localStorage.setItem("kisp-employees", JSON.stringify(employees));
      localStorage.setItem("kisp-dolar", JSON.stringify(dolarMap));
    } catch (e) { console.error("Storage save error:", e); }
    // Sync a Google Sheets con debounce de 3 segundos
    const timer = setTimeout(() => {
      try {
        fetch(SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ employees, dolarMap }),
        });
      } catch (e) { /* sin conexión, ignorar */ }
    }, 3000);
    return () => clearTimeout(timer);
  }, [employees, dolarMap, storageReady]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function saveHistory(empId, newHistory) {
    setEmployees(p => p.map(e => e.id === empId ? { ...e, history: newHistory } : e));
    showToast("Historial actualizado");
  }

  function saveNotes(empId, newNotes) {
    setEmployees(p => p.map(e => e.id === empId ? { ...e, notes: newNotes } : e));
  }

  const pendingReminders = useMemo(() => {
    const today = new Date().toISOString().slice(0,7);
    const results = [];
    employees.forEach(emp => {
      (emp.notes || []).forEach(note => {
        if (note.reminder && note.active !== false) {
          results.push({ emp, note });
        }
      });
    });
    return results.sort((a, b) => a.note.reminder.localeCompare(b.note.reminder));
  }, [employees]);

  // Active employees this month, with their current snapshot applied
  const activeWithSnap = useMemo(() => {
    return employees
      .filter(e => isActiveInMonth(e, year, month))
      .map(e => {
        const snap = snapshotAt(e, key + "-15");
        const payments = snap ? { ...snap.payments } : {};
        payments.Bonus = (e.bonusHistory || []).find(b => b.month === key)?.amount || 0;
        return { ...e, rank: snap ? snap.rank : "", payments };
      });
  }, [employees, year, month, key]);

  const inactiveFiltered = useMemo(() => {
    if (!showInactive) return [];
    return employees
      .filter(e => e.activeTo && (!search || e.name.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => b.activeTo.localeCompare(a.activeTo));
  }, [employees, showInactive, search]);

  const futureEmployees = useMemo(() => {
    if (!showFuture) return [];
    const today = new Date().toISOString().slice(0, 10);
    return employees
      .filter(e => e.activeFrom > today && !e.activeTo)
      .sort((a, b) => a.activeFrom.localeCompare(b.activeFrom));
  }, [employees, showFuture]);

  const filtered = useMemo(() => activeWithSnap.filter(e => {
    if (payFilter && !e.payments[payFilter]) return false;
    if (areaFilter !== "All" && e.area !== areaFilter) return false;
    if (supervisorFilter !== "All" && e.supervisor !== supervisorFilter) return false;
    if (teamFilter !== "All" && e.team !== teamFilter) return false;
    if (cargoFilter !== "All" && e.rank !== cargoFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !(e.supervisor||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeWithSnap, payFilter, areaFilter, supervisorFilter, teamFilter, cargoFilter, search]);

  const arsNomina = (pay) => useNominaCrypto ? toARSProfile(pay, dolar, dolarCrypto) : toARS(pay, dolar);

  const sortedFiltered = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      if (sortField === "total_asc")  return arsNomina(a.payments) - arsNomina(b.payments);
      if (sortField === "total_desc") return arsNomina(b.payments) - arsNomina(a.payments);
      if (sortField === "name_asc")   return a.name.localeCompare(b.name);
      if (sortField === "name_desc")  return b.name.localeCompare(a.name);
      return 0;
    });
  }, [filtered, sortField, dolar, dolarCrypto, useNominaCrypto]);

  const totalNomina   = useMemo(() => activeWithSnap.reduce((s, e) => s + toARS(e.payments, dolar), 0), [activeWithSnap, dolar]);
  const totalCosto    = useMemo(() => activeWithSnap.reduce((s, e) => {
    const p = e.payments;
    let t = (p.ARS || 0) * (1 + cargaSocial / 100);
    if (p.Crypto)     t += p.Crypto     * dolar;
    if (p.Canada)     t += p.Canada     * dolar;
    if (p.Healthcare) t += p.Healthcare * dolar;
    if (p.Allowance)  t += p.Allowance  * dolar;
    if (p.Cash2)      t += p.Cash2      * dolar;
    if (p.Bonus)      t += p.Bonus      * dolar;
    return s + t;
  }, 0), [activeWithSnap, dolar, cargaSocial]);
  const filteredTotal = useMemo(() => filtered.reduce((s, e) => s + arsNomina(e.payments), 0), [filtered, dolar, dolarCrypto, useNominaCrypto]);

  const payTotals = useMemo(() => {
    const t = {};
    PAYMENT_TYPES.forEach(pt => {
      const pp = activeWithSnap.filter(e => e.payments[pt] > 0);
      t[pt] = {
        count: pp.length,
        rawSum: pp.reduce((s, e) => s + (e.payments[pt] || 0), 0),
        arsSum: pp.reduce((s, e) => {
          const v = e.payments[pt] || 0;
          if (pt === "Crypto") return s + v * dolar;
          if (pt === "Canada") return s + v * CAD_TO_USD * dolar;
          return s + v;
        }, 0),
      };
    });
    // Healthcare split by origin
    const hCrypto = activeWithSnap.filter(e => e.payments.Healthcare > 0 && e.payments.Crypto > 0);
    const hCanada = activeWithSnap.filter(e => e.payments.Healthcare > 0 && e.payments.Canada > 0);
    t.HealthCrypto = { count: hCrypto.length, rawSum: hCrypto.reduce((s, e) => s + e.payments.Healthcare, 0) };
    t.HealthCanada = { count: hCanada.length, rawSum: hCanada.reduce((s, e) => s + e.payments.Healthcare, 0) };
    // Allowance split by origin (ids 21=ANDREA MARTINEZ, 179=MARIA MARTA HERNANDEZ van vía BsAs)
    const ALLOWANCE_BSAS_IDS = [21, 179];
    const aCrypto = activeWithSnap.filter(e => e.payments.Allowance > 0 && e.payments.Crypto > 0 && !ALLOWANCE_BSAS_IDS.includes(e.id));
    const aCanada = activeWithSnap.filter(e => e.payments.Allowance > 0 && e.payments.Canada > 0);
    const aBsAs   = activeWithSnap.filter(e => e.payments.Allowance > 0 && ALLOWANCE_BSAS_IDS.includes(e.id));
    t.AllowanceCrypto = { count: aCrypto.length, rawSum: aCrypto.reduce((s, e) => s + e.payments.Allowance, 0) };
    t.AllowanceCanada = { count: aCanada.length, rawSum: aCanada.reduce((s, e) => s + e.payments.Allowance, 0) };
    t.AllowanceBsAs   = { count: aBsAs.length,   rawSum: aBsAs.reduce((s, e) => s + e.payments.Allowance, 0) };
    return t;
  }, [activeWithSnap, dolar]);

  const teamOptions = useMemo(() => {
    const base = areaFilter !== "All" && DATA_BY_AREA[areaFilter]
      ? DATA_BY_AREA[areaFilter].teams
      : Array.from(new Set(activeWithSnap.map(e => e.team))).sort();
    return ["All", ...base];
  }, [activeWithSnap, areaFilter]);

  const supervisorOptions = useMemo(() => {
    const base = areaFilter !== "All"
      ? Array.from(new Set(activeWithSnap.filter(e => e.area === areaFilter).map(e => e.supervisor).filter(Boolean))).sort()
      : Array.from(new Set(activeWithSnap.map(e => e.supervisor).filter(Boolean))).sort();
    return ["All", ...base];
  }, [activeWithSnap, areaFilter]);

  const cargoOptions = useMemo(() => {
    const base = areaFilter !== "All" && DATA_BY_AREA[areaFilter]
      ? DATA_BY_AREA[areaFilter].cargos
      : Array.from(new Set(activeWithSnap.map(e => e.rank))).sort();
    return ["All", ...base];
  }, [activeWithSnap, areaFilter]);

  function goNominaFilter(pt) { setPayFilter(pt); setTeamFilter("All"); setCargoFilter("All"); setSearch(""); setShowFuture(false); setShowInactive(false); setView("nomina"); }
  function deactivate(emp) { setEmployees(p => p.map(e => e.id === emp.id ? { ...e, activeTo: key + "-31" } : e)); showToast(emp.name + " dado de baja", "warn"); }

  function fillTemplate(tmpl, emp, asHtml = false) {
    const startDate = emp.activeFrom ? fDateLong(emp.activeFrom) : "their start date";
    const PAY_LABELS = { ARS:"ARS", Crypto:"USDT", Canada:"Canada USD", Healthcare:"Healthcare USD", Allowance:"Allowance USD", Cash2:"Cash 2 USD", Bonus:"Bonus USD", Mono:"Monotributo BA" };
    const salaryParts = emp.payments ? Object.entries(emp.payments).filter(([,v]) => v > 0).map(([k,v]) => {
      const isUSD = k !== "ARS" && k !== "Monotributo";
      return (PAY_LABELS[k] || k) + ": " + (isUSD ? "U$" + v : "$" + Math.round(v).toLocaleString("es-AR"));
    }).join(" + ") : "—";
    const arsOnlyParts = emp.payments ? Object.entries(emp.payments).filter(([k,v]) => v > 0 && (k === "ARS" || k === "Monotributo")).map(([k,v]) => {
      return (PAY_LABELS[k] || k) + ": $" + Math.round(v).toLocaleString("es-AR");
    }).join(" + ") : "—";
    const monthYear = emp._monthYear || new Date().toLocaleDateString("en-US", { year:"numeric", month:"long" });
    const firstName = (emp.name || "").split(" ")[0].toLowerCase();
    const himHer = firstName.endsWith("a") ? "her" : "him";
    const cash2Amount = emp.payments && emp.payments.Cash2 ? Math.round(emp.payments.Cash2).toLocaleString("es-AR") : "—";
    const b = (v) => asHtml ? `<strong>${v}</strong>` : v;
    const nameVal  = b((emp.name || "—").toUpperCase());
    const dateVal  = asHtml ? `<strong>${startDate.toUpperCase()}</strong>` : startDate;
    const monthVal = asHtml ? `<strong>${monthYear.toUpperCase()}</strong>` : monthYear;
    return tmpl
      .replace(/\{name\}/g, nameVal)
      .replace(/\{startDate\}/g, dateVal)
      .replace(/\{dni\}/g, b(emp.dni || "—"))
      .replace(/\{address\}/g, b(emp.address || "—"))
      .replace(/\{personalEmail\}/g, b(emp.personalEmail || "—"))
      .replace(/\{area\}/g, b(emp.area || "—"))
      .replace(/\{team\}/g, b(emp.team || "—"))
      .replace(/\{salary\}/g, b(salaryParts))
      .replace(/\{arsNet\}/g, b(arsOnlyParts))
      .replace(/\{monthYear\}/g, monthVal)
      .replace(/\{cash2Amount\}/g, b(cash2Amount))
      .replace(/\{bonusAmount\}/g, b(emp.payments && emp.payments.Bonus ? Math.round(emp.payments.Bonus).toLocaleString("es-AR") : "—"))
      .replace(/\{cryptoAmount\}/g, b(emp.payments && emp.payments.Crypto ? Math.round(emp.payments.Crypto).toLocaleString("es-AR") : "—"))
      .replace(/\{changeDirection\}/g, emp._changeDirection || "updated")
      .replace(/\{himHer\}/g, himHer)
      .replace(/\{hisHer\}/g, firstName.endsWith("a") ? "her" : "his")
      .replace(/\{endDate\}/g, emp.activeTo ? fDateLong(emp.activeTo) : "—");
  }

  function openGmailDraft(tmplKey, emp) {
    const tmpl = emailTemplates[tmplKey];
    if (!tmpl) return;
    const filledSubject = fillTemplate(tmpl.subject, emp);
    const filledBody = fillTemplate(tmpl.body, emp);
    const filledHtmlBody = fillTemplate(tmpl.body, emp, true).replace(/\n/g, "<br>");
    fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        type: "draft",
        to: tmpl.to,
        cc: tmpl.cc || "",
        subject: filledSubject,
        body: filledBody,
        htmlBody: filledHtmlBody,
      }),
    });
    showToast("✉️ Borrador creado en Gmail");
  }

  function saveEmployee(emp, applyNextMonth = true) {
    try { _saveEmployee(emp, applyNextMonth); } catch(err) { alert("Error al guardar: " + err.message + "\n" + err.stack); }
  }
  function _saveEmployee(emp, applyNextMonth = true) {
    const isNew = !emp.id;
    if (emp.id) {
      // Detect Cash2 change
      const existing = employees.find(e => e.id === emp.id);
      const now = new Date();
      const targetMonth = applyNextMonth ? new Date(now.getFullYear(), now.getMonth() + 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
      const monthYear = targetMonth.toLocaleDateString("en-US", { year:"numeric", month:"long" });
      // Detect resignation (activeTo added)
      if (emp.activeTo && (!existing || !existing.activeTo)) {
        openGmailDraft("resignation", emp);
      }
      const oldCash2 = existing && existing.payments ? (existing.payments.Cash2 || 0) : 0;
      const newCash2 = emp.payments ? (emp.payments.Cash2 || 0) : 0;
      if (newCash2 !== oldCash2 && newCash2 > 0) {
        openGmailDraft("cash2Change", { ...emp, _monthYear: monthYear });
      }
      const newBonus = emp.bonusAmount || 0;
      const newBonusMonth = emp.bonusMonth || "";
      const oldEntry = (existing?.bonusHistory || []).find(b => b.month === newBonusMonth);
      if (newBonus > 0 && newBonusMonth && (!oldEntry || oldEntry.amount !== newBonus)) {
        const bonusMonthYear = new Date(newBonusMonth + "-15").toLocaleDateString("en-US", { year:"numeric", month:"long" });
        openGmailDraft("bonusChange", { ...emp, _monthYear: bonusMonthYear });
      }
      if (newBonus > 0 && newBonusMonth) {
        // Replace entry for same month if exists, otherwise append
        const prevHistory = (existing?.bonusHistory || []).filter(b => b.month !== newBonusMonth);
        emp = { ...emp, bonusHistory: [...prevHistory, { month: newBonusMonth, amount: newBonus }] };
      }
      if (newBonus === 0 && newBonusMonth) {
        // Clear bonus for specific month
        emp = { ...emp, bonusHistory: (existing?.bonusHistory || []).filter(b => b.month !== newBonusMonth) };
      }
      const lastSnap2 = existing && existing.history.length > 0 ? existing.history[existing.history.length - 1] : null;
      const oldCrypto = lastSnap2?.payments?.Crypto || 0;
      const newCrypto = emp.payments ? (emp.payments.Crypto || 0) : 0;
      const oldCanada = lastSnap2?.payments?.Canada || 0;
      const newCanada = emp.payments ? (emp.payments.Canada || 0) : 0;
      if (newCrypto !== oldCrypto && newCrypto > 0) {
        openGmailDraft("cryptoChange", { ...emp, _monthYear: monthYear, _changeDirection: newCrypto > oldCrypto ? "increased" : "decreased" });
      }
      if (oldCrypto > 0 && newCrypto === 0 && newCanada > 0 && oldCanada === 0) {
        openGmailDraft("cryptoToCanada", { ...emp, _monthYear: monthYear });
      }
      // Detect trunk change (placeholder — draft to be defined)
      const TRUNKS = ["Crypto","Canada","Mono","ARS"];
      const oldTrunk = TRUNKS.find(t => (lastSnap2?.payments?.[t] || 0) > 0) || null;
      const newTrunk = TRUNKS.find(t => (emp.payments?.[t] || 0) > 0) || null;
      if (oldTrunk && newTrunk && oldTrunk !== newTrunk) {
        showToast("⚠️ Troncal cambiado de " + oldTrunk + " → " + newTrunk + " (draft pendiente de configurar)");
      }
      setEmployees(p => p.map(e => {
        if (e.id !== emp.id) return e;
        const existing = employees.find(ex => ex.id === emp.id);
        const lastSnap = existing && existing.history.length > 0 ? existing.history[existing.history.length - 1] : null;
        // Strip zero-value keys so {Canada:1500, Crypto:0} == {Canada:1500}
        // Bonus is intentionally excluded from history snapshots (stored in bonusAmount/bonusMonth instead)
        const stripZeros = o => Object.fromEntries(Object.entries(o || {}).filter(([k, v]) => v > 0 && k !== "Bonus"));
        const cleanPayments = stripZeros(emp.payments);
        const lastPayments = stripZeros(lastSnap?.payments);
        const sortedStr = o => JSON.stringify(Object.fromEntries(Object.entries(o).sort()));
        const paymentsChanged = sortedStr(lastPayments) !== sortedStr(cleanPayments);
        const rankChanged = lastSnap?.rank !== emp.rank;
        let newHistory = e.history.length > 0 ? [...e.history] : [];
        const _nd = new Date();
        _nd.setDate(1);
        _nd.setMonth(_nd.getMonth() + 1);
        const nextMonthKey = _nd.getFullYear() + "-" + String(_nd.getMonth() + 1).padStart(2, "0");
        const nextMonthFrom = nextMonthKey + "-01";
        const curMonthKey = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0");
        const targetMonthKey = applyNextMonth ? nextMonthKey : curMonthKey;
        const targetMonthFrom = targetMonthKey + "-01";
        // Si el empleado se va este mes, guardar EN el mes actual (no en el siguiente)
        const leavingThisMonth = emp.activeTo && emp.activeTo.slice(0, 7) <= curMonthKey;
        if (paymentsChanged || rankChanged) {
          if (leavingThisMonth) {
            // Actualizar la última entrada del mes actual o anterior en lugar de crear una de mes siguiente
            const lastApplicableIdx = newHistory.reduce((acc, s, i) => s.from.slice(0, 7) <= curMonthKey ? i : acc, -1);
            if (lastApplicableIdx >= 0) {
              newHistory = newHistory.map((s, i) => i === lastApplicableIdx ? { ...s, payments: cleanPayments, rank: emp.rank } : s);
            } else {
              newHistory = [...newHistory, { from: curMonthKey + "-01", rank: emp.rank, payments: cleanPayments, note: "" }];
            }
          } else {
            const lastFrom = newHistory.length > 0 ? newHistory[newHistory.length - 1].from.slice(0, 7) : null;
            if (lastFrom === targetMonthKey) {
              newHistory = newHistory.map((s, i) => i === newHistory.length - 1 ? { ...s, payments: cleanPayments, rank: emp.rank } : s);
            } else {
              newHistory = [...newHistory, { from: targetMonthFrom, rank: emp.rank, payments: cleanPayments, note: "" }];
            }
          }
        }
        // Always strip Bonus from ALL snapshots (bonus lives in bonusAmount/bonusMonth, not in history)
        newHistory = newHistory.map(s => { const { Bonus, ...rest } = s.payments || {}; return { ...s, payments: rest }; });
        const { bonusAmount: _ba, bonusMonth: _bm, ...empClean } = emp;
        return { ...empClean, bonusVersion: 5, history: newHistory };
      }));
    } else {
      const newEmp = { ...emp, id: Date.now(), history: [{ from: emp.activeFrom || new Date().toISOString().slice(0, 10), rank: emp.rank, payments: { ...emp.payments }, note: "Ingreso" }] };
      setEmployees(p => [...p, newEmp]);
      if (!emp.activeFrom) { showToast("⚠️ Empleado guardado sin fecha de inicio — drafts no enviados", "warn"); return; }
      // Auto-send onboarding email by area
      if (emp.area === "SALES SUPPORT") openGmailDraft("salesSupport", emp);
      if (emp.area === "CAD")           openGmailDraft("cad", emp);
      // Auto-send by payment type
      if (emp.payments && emp.payments.Crypto) openGmailDraft("crypto", emp);
      if (emp.payments && emp.payments.Canada) openGmailDraft("canadaNew", emp);
      if (emp.payments && emp.payments.Mono) openGmailDraft("monotributo", emp);
      if (emp.payments && emp.payments.ARS && !emp.payments.Mono) openGmailDraft("dependencia", emp);
    }
    showToast(emp.name + " guardado");
    setModal(null);
  }

  function fireOnboardingDrafts(emp) {
    if (!emp.activeFrom) { showToast("⚠️ Sin fecha de inicio — drafts no enviados", "warn"); return; }
    if (emp.area === "SALES SUPPORT") openGmailDraft("salesSupport", emp);
    if (emp.area === "CAD")           openGmailDraft("cad", emp);
    if (emp.payments && emp.payments.Crypto) openGmailDraft("crypto", emp);
    if (emp.payments && emp.payments.Canada) openGmailDraft("canadaNew", emp);
    if (emp.payments && emp.payments.Mono) openGmailDraft("monotributo", emp);
    if (emp.payments && emp.payments.ARS && !emp.payments.Mono) openGmailDraft("dependencia", emp);
    showToast("✉️ Drafts de onboarding enviados para " + emp.name);
  }

  const NAV = [["dashboard", "Dashboard", "Dash"], ["nomina", "Nomina", "Nómina"], ["ranking", "Ranking", "Rank"], ["comparar", "Comparar", "Comp."], ["historial", "Historial", "Hist."], ["bonos", "Bonos", "Bonos"], ["config", "Config", "Config"]];

  // Set mobile viewport
  useEffect(() => {
    const existing = document.querySelector('meta[name="viewport"]');
    if (!existing) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      document.head.appendChild(meta);
    } else {
      existing.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 500;

  if (!storageReady) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{fontFamily:"Inter,system-ui,sans-serif"}}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin" style={{borderTopColor:"#0a4a3a"}} />
        <div className="text-sm text-gray-500 font-medium">Cargando nómina...</div>
      </div>
    </div>
  );

  if (loadError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{fontFamily:"Inter,system-ui,sans-serif"}}>
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg max-w-sm text-center">
        <div className="text-4xl">⚠️</div>
        <div className="text-lg font-bold text-gray-800">No se pudo conectar con Google Sheets</div>
        <div className="text-sm text-gray-500">Los datos no están disponibles. Por favor verificá tu conexión y recargá la página.</div>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700">
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "Inter,system-ui,sans-serif", WebkitTextSizeAdjust: "100%" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* NAV */}
      <div className="px-3 py-2 flex items-center justify-between shadow-sm gap-2" style={{background:"#e8f5f0",borderBottom:"2px solid #0a4a3a"}}>
        <div className="flex items-center gap-3">
          {/* KiSP Logo */}
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAQTBBMDASIAAhEBAxEB/8QAHgABAAMAAwADAQAAAAAAAAAAAAYICQQFBwIDCgH/xABbEAEAAQMCAwEJCwYKBggEBwAAAQIDBAUGBwgRIRIxNzhBV3aVtAkTFxgiUWGEpdLTFBkyQnF1FTNSVFZ0gbKz1CMkQ3KRoRYlNGKCkpPRRFWxwVNkg5SWo8L/xAAbAQEAAwADAQAAAAAAAAAAAAAAAwQGAgUHAf/EADkRAQABAgIEDQMDBQEBAQEAAAABAgMEEQUSMZEGExQhNEFRU2FxcrHBMjNSFdHhFiKBofDxI0KS/9oADAMBAAIRAxEAPwDT0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5zx3477H5ftkX947xyu7uV91a07TrVURkahkdOsW7cT3ojsmqueymO2eszET8uOvHLZnADYeTvfeF+qvt94wMC1VEXs/JmJmm1R173e61VT2U0xM9vZE438bONm+OPO+Mne+987u7lfW3h4duZjHwcfr1ps2qZ70R5Z79U9ZnrMpKKNbnnY6XS2lqcBTqUc9c/wCvGfh3nEvmm43cTN45+7szf+uaRGVV0safpWpX8bFxbMfoW6KKKoiekd+qflVT1mZ6yi3wz8YfOxvL17lffQ4WMoYSrEXa6pqqqnOfFMfhn4w+djeXr3K++fDPxh87G8vXuV99Dh9yhx465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U70x+GfjD52N5evcr758M/GHzsby9e5X30ODKDjrn5TvTH4Z+MPnY3l69yvvnwz8YfOxvL17lffQ4MoOOuflO9Mfhn4w+djeXr3K++fDPxh87G8vXuV99Dgyg465+U72oHKlu7des8Atralq+59Wzsu9+Xe+ZGTm3Ltyvpm34jrVVVMz0iIj9kQOp5QPF12l9f8AbsgVqtstxhKqpw9uc+qPZegBG78AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQHjZxs2PwG2Rk733vndxbo628PDtzE5GdkdOtNm1TPfmfLPepjr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" alt="KiSP" style={{height:44,width:"auto",objectFit:"contain",borderRadius:4,flexShrink:0}} />
        </div>
        <div className="flex items-center gap-1">
          {NAV.map(([v, l, s]) => (
            <button key={v} onClick={() => { if (v === "nomina") setPayFilter(null); setView(v); }}
              className={"px-2 py-1 rounded-lg text-xs font-medium transition-all "}
              style={view === v ? {background:"#0a4a3a", color:"white"} : {color:"#0a4a3a"}}>
              {isMobile ? s : l}
            </button>
          ))}
        </div>
      </div>

      {/* PENDING DRAFTS BANNER */}
      {pendingDrafts.length > 0 && (
        <div className="mx-3 mt-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">📬</span>
              <span className="text-sm font-bold text-amber-800">
                {pendingDrafts.length} borrador{pendingDrafts.length > 1 ? "es" : ""} pendiente{pendingDrafts.length > 1 ? "s" : ""} de envío
              </span>
            </div>
            <button onClick={() => setPendingDrafts([])}
              className="text-xs text-amber-400 hover:text-amber-700 font-medium">
              Limpiar todo
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {pendingDrafts.map(d => (
              <div key={d.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-amber-100">
                <a href={d.url} target="_blank" rel="noreferrer"
                  className="text-xs text-amber-700 underline truncate flex-1 min-w-0">{d.subject}</a>
                <span className="text-xs text-amber-300 shrink-0">{d.createdAt}</span>
                <button onClick={() => setPendingDrafts(p => p.filter(x => x.id !== d.id))}
                  className="text-xs px-2.5 py-1 rounded-full font-bold shrink-0 text-white"
                  style={{background:"#166534"}}>✓ Enviado</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YEAR / MONTH / DOLAR BAR */}
      {view !== "config" && (
        <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setYear(y => Math.max(YEARS[0], y - 1))} className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-500 font-bold">‹</button>
              <span className="font-black text-gray-900 text-sm px-2 min-w-12 text-center">{year}</span>
              <button onClick={() => setYear(y => Math.min(YEARS[YEARS.length - 1], y + 1))} className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-500 font-bold">›</button>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex gap-1 flex-wrap">
              {MONTHS.map((m, i) => (
                <button key={i} onClick={() => setMonth(i)}
                  className={"px-3 py-1 rounded-lg text-xs font-bold transition-all " + (month === i ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:bg-gray-100")}>
                  {m.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {(() => {
              const curKey = mkey(new Date().getFullYear(), new Date().getMonth());
              const isCurrentMonth = key === curKey;
              if (ipcMap[key] != null || isCurrentMonth) return (
                <div className="flex flex-col items-end py-2">
                  <span className="text-gray-400 text-xs font-medium mb-1">IPC INDEC</span>
                  <span className="bg-orange-50 border border-orange-300 text-orange-800 font-bold text-sm px-3 py-1 rounded-lg">
                    {isCurrentMonth && ipcMap[key] == null ? "—" : (ipcMap[key] > 0 ? "+" : "") + ipcMap[key].toFixed(1) + "%"}
                  </span>
                </div>
              );
            })()}
            {/* Dolar Blue */}
            <div className={"flex flex-col items-end rounded-xl px-3 py-2 border-2 transition-all cursor-pointer " + (!useNominaCrypto ? "border-emerald-400 bg-emerald-50" : "border-transparent")}
              onClick={() => setUseNominaCrypto(false)}>
              <span className={"text-xs font-medium mb-1 " + (!useNominaCrypto ? "text-emerald-700 font-semibold" : "text-gray-400")}>
                {!useNominaCrypto ? "✓ Dolar Blue" : "Dolar Blue"}
              </span>
              {editDolar
                ? <input type="number" autoFocus className="w-28 border-2 border-emerald-400 rounded-lg px-2 py-1 text-sm font-bold text-center focus:outline-none"
                    value={dolar} onChange={e => setDolarMap(p => ({ ...p, [key]: Number(e.target.value) }))} onBlur={() => setEditDolar(false)}
                    onClick={e => e.stopPropagation()} />
                : <button onClick={e => { e.stopPropagation(); setEditDolar(true); }}
                    className={"font-bold text-sm px-3 py-1 rounded-lg border " + (!useNominaCrypto ? "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200" : "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100")}>
                    ${dolar.toLocaleString("es-AR")}
                  </button>
              }
            </div>
            {/* Dolar Crypto */}
            <div className={"flex flex-col items-end rounded-xl px-3 py-2 border-2 transition-all cursor-pointer " + (useNominaCrypto ? "border-purple-400 bg-purple-50" : "border-transparent")}
              onClick={() => setUseNominaCrypto(true)}>
              <span className={"text-xs font-medium mb-1 " + (useNominaCrypto ? "text-purple-700 font-semibold" : "text-gray-400")}>
                {useNominaCrypto ? "✓ Dolar Crypto" : "Dolar Crypto"}
              </span>
              {editDolarCrypto
                ? <input type="number" autoFocus className="w-28 border-2 border-purple-400 rounded-lg px-2 py-1 text-sm font-bold text-center focus:outline-none"
                    value={dolarCrypto || ""} onChange={e => setDolarCryptoMap(p => ({ ...p, [key]: Number(e.target.value) }))} onBlur={() => setEditDolarCrypto(false)}
                    onClick={e => e.stopPropagation()} />
                : <button onClick={e => { e.stopPropagation(); setEditDolarCrypto(true); }}
                    className={"font-bold text-sm px-3 py-1 rounded-lg border " + (useNominaCrypto ? "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200" : "bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100")}>
                    {dolarCrypto > 0 ? "$" + dolarCrypto.toLocaleString("es-AR") : "—"}
                  </button>
              }
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-3 py-3 md:px-5 md:py-5 space-y-4">

        {/* ── DASHBOARD ── */}
        {view === "dashboard" && (
          <div className="space-y-5">

            {/* Reminders alert */}
            <div className={"rounded-2xl p-4 border " + (pendingReminders.length > 0 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200")}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🔔</span>
                  <span className={"font-black text-sm " + (pendingReminders.length > 0 ? "text-amber-800" : "text-gray-500")}>Reminders pendientes ({pendingReminders.length})</span>
                </div>
                {pendingReminders.length > 0 && <div className="space-y-1.5 mt-2">
                  {pendingReminders.map(({ emp, note }) => {
                    const isOverdue = note.reminder < new Date().toISOString().slice(0,7);
                    return (
                      <div key={note.id} className="flex items-start gap-3 bg-white rounded-xl border border-amber-100 px-3 py-2 cursor-pointer hover:border-amber-300 group"
                        onClick={() => setProfileEmp(employees.find(e => e.id === emp.id))}>
                        <div className={"w-6 h-6 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                          {initials(emp.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-800">{emp.name}</span>
                            <span className={"inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full " + (isOverdue ? "bg-red-100 text-red-700" : note.reminder === new Date().toISOString().slice(0,7) ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700")}>
                              {isOverdue ? "⚠️ Vencido" : note.reminder === new Date().toISOString().slice(0,7) ? "🔔 Este mes" : "📅"} {MONTHS[parseInt(note.reminder.slice(5,7))-1]} {note.reminder.slice(0,4)}
                              <button onClick={e => { e.stopPropagation(); saveNotes(emp.id, (emp.notes||[]).map(n => n.id===note.id ? {...n, reminder:""} : n)); }} className="ml-0.5 hover:opacity-60 font-black leading-none">×</button>
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 truncate">{note.text}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); saveNotes(emp.id, (emp.notes||[]).map(n => n.id===note.id ? {...n, active:false, reminder:""} : n)); }}
                          title="Archivar nota"
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 bg-white self-center">
                          Archivar
                        </button>
                      </div>
                    );
                  })}
                </div>}
            </div>

            {/* Anniversary alerts */}
            {anniversaryAlerts.length > 0 && (
              <div className="rounded-2xl p-4 border bg-emerald-50 border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🎂</span>
                  <span className="font-black text-sm text-emerald-800">Aniversarios este mes ({anniversaryAlerts.length})</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {anniversaryAlerts.map(({ emp, label, type }) => (
                    <div key={emp.id}
                      className={"flex items-center gap-3 bg-white rounded-xl border px-3 py-2 cursor-pointer hover:shadow-sm " + (type === "year" ? "border-yellow-200 hover:border-yellow-300" : "border-emerald-100 hover:border-emerald-300")}
                      onClick={() => setProfileEmp(employees.find(e => e.id === emp.id))}>
                      <div className={"w-7 h-7 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                        {initials(emp.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.team} · {emp.area}</div>
                      </div>
                      <span className={"text-xs font-bold px-2 py-1 rounded-full " + (type === "year" ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800")}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Costo Total", value: fARS(totalCosto), sub: activeWithSnap.length + " empleados · " + MONTHS[month] + " " + year, icon: "$" },
                { label: "Equiv. USD", value: fUSD(dolar > 0 ? totalCosto / dolar : 0), sub: "Dolar blue $" + dolar.toLocaleString("es-AR"), icon: "🇺🇸" },
                { label: "Promedio", value: activeWithSnap.length > 0 ? fARS(totalCosto / activeWithSnap.length) : "—", sub: "≈ " + (activeWithSnap.length > 0 && dolar > 0 ? fUSD((totalCosto / activeWithSnap.length) / dolar) : "—") + " · por empleado", icon: "=" },
                { label: "Teams Activos", value: new Set(activeWithSnap.map(e => e.team)).size, sub: "de " + teams.length + " equipos", icon: "[T]" },
              ].map(({ label, value, sub, icon }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PAYMENT_TYPES.map(pt => {
                const s = payTotals[pt];
                const meta = PAYMENT_META[pt];
                const cc = COLOR[meta.color];
                const raw = (pt === "ARS" || pt === "Mono") ? fARS(s.rawSum) : pt === "Crypto" ? "U$ " + s.rawSum.toLocaleString("es-AR") + " USDT" : "U$ " + s.rawSum.toLocaleString("es-AR");
                return (
                  <button key={pt} onClick={() => goNominaFilter(pt)}
                    className={"rounded-xl p-4 border text-left transition-all hover:shadow-md hover:scale-[1.02] group " + cc.bg + " " + cc.border}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-2xl font-bold text-gray-400">{pt.substring(0,3).toUpperCase()}</div>
                        <div className={"font-bold text-sm mt-1 " + cc.text}>{meta.label}</div>
                      </div>
                      <div className="text-right">
                        <div className={"text-2xl font-black " + cc.text}>{s.count}</div>
                        <div className={"text-xs opacity-50 " + cc.text}>personas</div>
                      </div>
                    </div>
                    <div className={"text-base font-bold " + cc.text}>{raw}</div>
                    {pt === "Allowance" && (
                      <div className="mt-2 pt-2 border-t border-pink-100 space-y-1">
                        {payTotals.AllowanceCrypto.count > 0 && (
                          <div className="flex items-center justify-between">
                            <span className={"text-xs opacity-60 " + cc.text}>vía Crypto ({payTotals.AllowanceCrypto.count}p)</span>
                            <span className={"text-xs font-bold " + cc.text}>U$ {payTotals.AllowanceCrypto.rawSum.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                        {payTotals.AllowanceCanada.count > 0 && (
                          <div className="flex items-center justify-between">
                            <span className={"text-xs opacity-60 " + cc.text}>vía Canada ({payTotals.AllowanceCanada.count}p)</span>
                            <span className={"text-xs font-bold " + cc.text}>U$ {payTotals.AllowanceCanada.rawSum.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                        {payTotals.AllowanceBsAs?.count > 0 && (
                          <div className="flex items-center justify-between">
                            <span className={"text-xs opacity-60 " + cc.text}>vía Bs.As. ({payTotals.AllowanceBsAs.count}p)</span>
                            <span className={"text-xs font-bold " + cc.text}>U$ {payTotals.AllowanceBsAs.rawSum.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {pt === "Healthcare" && (
                      <div className="mt-2 pt-2 border-t border-pink-100 space-y-1">
                        {payTotals.HealthCrypto.count > 0 && (
                          <div className="flex items-center justify-between">
                            <span className={"text-xs opacity-60 " + cc.text}>vía Crypto ({payTotals.HealthCrypto.count}p)</span>
                            <span className={"text-xs font-bold " + cc.text}>U$ {payTotals.HealthCrypto.rawSum.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                        {payTotals.HealthCanada.count > 0 && (
                          <div className="flex items-center justify-between">
                            <span className={"text-xs opacity-60 " + cc.text}>vía Canada ({payTotals.HealthCanada.count}p)</span>
                            <span className={"text-xs font-bold " + cc.text}>U$ {payTotals.HealthCanada.rawSum.toLocaleString("es-AR")}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {pt === "ARS" && (
                      <div className="mt-2 pt-2 border-t border-blue-100 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={"text-xs opacity-60 " + cc.text}>cargas sociales</span>
                          <div className="flex items-center gap-1">
                            <input type="number" min="0" max="200"
                              className={"w-10 text-xs font-bold bg-transparent focus:outline-none text-right " + cc.text}
                              value={cargaInput}
                              onClick={e => e.stopPropagation()}
                              onChange={e => setCargaInput(e.target.value)}
                              onBlur={e => { const v = Math.max(0, Number(e.target.value) || 0); setCargaSocial(v); setCargaInput(String(v)); }} />
                            <span className={"text-xs font-bold " + cc.text}>%</span>
                          </div>
                        </div>
                        <div className={"text-xs opacity-70 " + cc.text}>{fARS(s.rawSum * cargaSocial / 100)}</div>
                        <div className="flex items-center justify-between pt-1 border-t border-blue-100">
                          <span className={"text-xs font-bold opacity-60 " + cc.text}>Total c/ cargas</span>
                          <span className={"text-base font-black " + cc.text}>{fARS(s.rawSum * (1 + cargaSocial / 100))}</span>
                        </div>
                      </div>
                    )}
                    {/* Canada: no mostrar equiv ARS */}
                    <div className={"text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity " + cc.text}>Ver nomina →</div>
                  </button>
                );
              })}
            </div>

            {/* ── FLUJOS POR ORIGEN ── */}
            {(() => {
              const flujoCrypto = (payTotals.Crypto?.rawSum || 0)
                + (payTotals.HealthCrypto?.rawSum || 0)
                + (payTotals.AllowanceCrypto?.rawSum || 0);
              const flujoCanada = (payTotals.Canada?.rawSum || 0)
                + (payTotals.HealthCanada?.rawSum || 0)
                + (payTotals.AllowanceCanada?.rawSum || 0);
              const monoUSD = dolar > 0 ? (payTotals.Mono?.rawSum || 0) / dolar : 0;
              const flujoBsAs = (payTotals.Cash2?.rawSum || 0) + (payTotals.Bonus?.rawSum || 0) + (payTotals.AllowanceBsAs?.rawSum || 0) + monoUSD;
              const total = flujoCrypto + flujoCanada + flujoBsAs;
              const pctCrypto = total > 0 ? (flujoCrypto / total * 100) : 0;
              const pctCanada = total > 0 ? (flujoCanada / total * 100) : 0;
              const pctBsAs   = total > 0 ? (flujoBsAs   / total * 100) : 0;
              const flujos = [
                { label: "Crypto", emoji: "₿", usd: flujoCrypto, pct: pctCrypto, bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", bar: "bg-purple-400",
                  detail: [
                    { label: "Salarios", val: payTotals.Crypto?.rawSum || 0 },
                    { label: "Healthcare", val: payTotals.HealthCrypto?.rawSum || 0 },
                    { label: "Allowance", val: payTotals.AllowanceCrypto?.rawSum || 0 },
                  ]},
                { label: "Canada", emoji: "🍁", usd: flujoCanada, pct: pctCanada, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", bar: "bg-red-400",
                  detail: [
                    { label: "Salarios", val: payTotals.Canada?.rawSum || 0 },
                    { label: "Healthcare", val: payTotals.HealthCanada?.rawSum || 0 },
                    { label: "Allowance", val: payTotals.AllowanceCanada?.rawSum || 0 },
                  ]},
                { label: "Buenos Aires", emoji: "🇦🇷", usd: flujoBsAs, pct: pctBsAs, bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", bar: "bg-sky-400",
                  detail: [
                    { label: "Cash 2", val: payTotals.Cash2?.rawSum || 0 },
                    { label: "Bonus", val: payTotals.Bonus?.rawSum || 0 },
                    { label: "Allowance", val: payTotals.AllowanceBsAs?.rawSum || 0 },
                    { label: "Monotributo (ARS)", val: dolar > 0 ? (payTotals.Mono?.rawSum || 0) / dolar : 0 },
                  ]},
              ];
              return (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="font-semibold text-gray-800 mb-1">Flujos por origen — {MONTHS[month]} {year}</div>
                  <div className="text-xs text-gray-400 mb-4">Total enviado en USD equivalente</div>
                  <div className="flex rounded-full overflow-hidden h-3 mb-5 gap-0.5">
                    {flujos.map(f => f.pct > 0 && <div key={f.label} className={f.bar} style={{width: f.pct + "%"}} title={f.label + " " + f.pct.toFixed(1) + "%"} />)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {flujos.map(f => (
                      <div key={f.label} className={"rounded-xl p-4 border " + f.bg + " " + f.border}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={"font-bold text-sm " + f.text}>{f.emoji} {f.label}</span>
                          <span className={"text-xs font-bold opacity-60 " + f.text}>{f.pct.toFixed(1)}%</span>
                        </div>
                        <div className={"text-2xl font-black mb-3 " + f.text}>{fUSD(f.usd)}</div>
                        <div className="space-y-1">
                          {f.detail.filter(d => d.val > 0).map(d => (
                            <div key={d.label} className="flex items-center justify-between">
                              <span className={"text-xs opacity-60 " + f.text}>{d.label}</span>
                              <span className={"text-xs font-semibold " + f.text}>{fUSD(d.val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="font-semibold text-gray-800 mb-4">Costo por área y equipo — {MONTHS[month]} {year}</div>
              <div className="space-y-5">
                {(() => {
                  const areas = Array.from(new Set(activeWithSnap.map(e => e.area || "Sin área"))).sort();
                  const totalUSD = dolar > 0 ? totalCosto / dolar : 0;
                  return areas.map(area => {
                    const areaEmps = activeWithSnap.filter(e => (e.area || "Sin área") === area);
                    const areaCostUSD = dolar > 0 ? areaEmps.reduce((s, e) => s + toCosto(e.payments, dolar, cargaSocial), 0) / dolar : 0;
                    const areaPct = totalUSD > 0 ? (areaCostUSD / totalUSD) * 100 : 0;
                    const teams = Array.from(new Set(areaEmps.map(e => e.team || "Sin equipo"))).sort();
                    return (
                      <div key={area}>
                        {/* Area header */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-xs font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-md shrink-0" style={{background:"#0a4a3a"}}>{area}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="h-2 rounded-full" style={{width: areaPct + "%", background:"#0a4a3a"}} />
                          </div>
                          <div className="text-sm font-bold text-gray-800 w-28 text-right shrink-0">{fUSD(areaCostUSD)}</div>
                          <div className="text-xs text-gray-400 w-10 text-right shrink-0">{areaEmps.length}p</div>
                        </div>
                        {/* Teams inside area */}
                        <div className="pl-4 space-y-1.5 border-l-2 ml-1" style={{borderColor:"#0a4a3a22"}}>
                          {teams.map(team => {
                            const emps = areaEmps.filter(e => (e.team || "Sin equipo") === team);
                            const totUSD = dolar > 0 ? emps.reduce((s, e) => s + toCosto(e.payments, dolar, cargaSocial), 0) / dolar : 0;
                            const pct = areaCostUSD > 0 ? (totUSD / areaCostUSD) * 100 : 0;
                            return (
                              <div key={team} className="flex items-center gap-3">
                                <div className="w-36 text-xs text-gray-500 font-medium shrink-0 truncate">{team}</div>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-1.5 rounded-full bg-gray-400" style={{width: pct + "%"}} />
                                </div>
                                <div className="text-xs font-semibold text-gray-700 w-28 text-right shrink-0">{fUSD(totUSD)}</div>
                                <div className="text-xs text-gray-400 w-10 text-right shrink-0">{emps.length}p</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── NOMINA ── */}
        {view === "nomina" && (
          <div className="space-y-3">
            {/* filters bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-2">
              {/* Row 1: search + nuevo empleado */}
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 pr-5" />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                  )}
                </div>
                <button
                  onClick={() => setShowFuture(v => !v)}
                  title="Ver próximos ingresos"
                  className={"shrink-0 px-2 py-2 rounded-lg text-xs font-medium border transition-colors " + (showFuture ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200")}
                >
                  {showFuture ? "Futuros ×" : "Futuros"}
                </button>
                <button
                  onClick={() => setShowInactive(v => !v)}
                  title="Buscar empleados inactivos"
                  className={"shrink-0 px-2 py-2 rounded-lg text-xs font-medium border transition-colors " + (showInactive ? "bg-red-100 text-red-700 border-red-300" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200")}
                >
                  {showInactive ? "Inactivos ×" : "Inactivos"}
                </button>
                <button onClick={() => {
                    const emps = activeWithSnap.slice().sort((a,b) => (a.area||"").localeCompare(b.area||"") || a.name.localeCompare(b.name));
                    const grouped = {};
                    emps.forEach(e => { if (!grouped[e.area]) grouped[e.area] = []; grouped[e.area].push(e); });
                    const dolar = dolarMap[key] || 0;
                    const pts = PAYMENT_TYPES;
                    const rows = Object.entries(grouped).map(([area, list]) => {
                      const empRows = list.map(e => `<tr>
                        <td style="padding:5px 8px;font-size:10px">${e.name}</td>
                        ${pts.map(pt => `<td style="padding:5px 8px;font-size:10px;text-align:right">${e.payments[pt] > 0 ? (pt==="ARS"||pt==="Mono" ? "$"+Math.round(e.payments[pt]).toLocaleString("es-AR") : "U$"+e.payments[pt].toLocaleString("es-AR")) : ""}</td>`).join("")}
                        <td style="padding:5px 8px;font-size:10px;text-align:right;font-weight:700">${fARS(toARS(e.payments,dolar))}</td>
                      </tr>`).join("");
                      const totPay = {};
                      pts.forEach(pt => { totPay[pt] = list.reduce((s,e) => s+(e.payments[pt]||0),0); });
                      const totARS = list.reduce((s,e) => s+toARS(e.payments,dolar),0);
                      return `
                        <tr><td colspan="${pts.length+2}" style="padding:8px;background:#1f2937;color:white;font-weight:700;font-size:11px">${area} — ${list.length} empleados</td></tr>
                        ${empRows}
                        <tr style="background:#f3f4f6;font-weight:700">
                          <td style="padding:5px 8px;font-size:10px">Subtotal</td>
                          ${pts.map(pt => `<td style="padding:5px 8px;font-size:10px;text-align:right">${totPay[pt]>0?(pt==="ARS"||pt==="Mono"?"$"+Math.round(totPay[pt]).toLocaleString("es-AR"):"U$"+totPay[pt].toLocaleString("es-AR")):""}</td>`).join("")}
                          <td style="padding:5px 8px;font-size:10px;text-align:right">${fARS(totARS)}</td>
                        </tr>`;
                    }).join("");
                    const grandTotal = activeWithSnap.reduce((s,e) => s+toARS(e.payments,dolar),0);
                    const flujoCrypto = (payTotals.Crypto?.rawSum||0)+(payTotals.HealthCrypto?.rawSum||0)+(payTotals.AllowanceCrypto?.rawSum||0);
                    const flujoCanada = (payTotals.Canada?.rawSum||0)+(payTotals.HealthCanada?.rawSum||0)+(payTotals.AllowanceCanada?.rawSum||0);
                    const monoUSD = dolar > 0 ? (payTotals.Mono?.rawSum||0)/dolar : 0;
                    const flujoBsAs = (payTotals.Cash2?.rawSum||0)+(payTotals.Bonus?.rawSum||0)+(payTotals.AllowanceBsAs?.rawSum||0)+monoUSD;
                    const totalFlujoUSD = flujoCrypto + flujoCanada + flujoBsAs;
                    const flujos = [
                      { label:"Crypto", color:"#7c3aed", detail:[
                        { label:"Salarios USDT", val:payTotals.Crypto?.rawSum||0 },
                        { label:"Healthcare", val:payTotals.HealthCrypto?.rawSum||0 },
                        { label:"Allowance", val:payTotals.AllowanceCrypto?.rawSum||0 },
                      ], total: flujoCrypto },
                      { label:"Canada USD", color:"#b91c1c", detail:[
                        { label:"Salarios Canada", val:payTotals.Canada?.rawSum||0 },
                        { label:"Healthcare", val:payTotals.HealthCanada?.rawSum||0 },
                        { label:"Allowance", val:payTotals.AllowanceCanada?.rawSum||0 },
                      ], total: flujoCanada },
                      { label:"Buenos Aires", color:"#0369a1", detail:[
                        { label:"Cash 2", val:payTotals.Cash2?.rawSum||0 },
                        { label:"Bonus", val:payTotals.Bonus?.rawSum||0 },
                        { label:"Allowance", val:payTotals.AllowanceBsAs?.rawSum||0 },
                        { label:"Monotributo (equiv USD)", val:monoUSD },
                      ], total: flujoBsAs },
                    ];
                    const w = window.open("","_blank");
                    if (!w) { alert("Permitir popups para imprimir"); return; }
                    w.document.write(`<!DOCTYPE html><html><head><meta charset='UTF-8'><style>
                      @page{margin:12mm;size:A4 landscape}
                      *{box-sizing:border-box;font-family:Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
                      body{margin:0;padding:12px;font-size:10px;color:#111}
                      table{width:100%;border-collapse:collapse}
                      th{background:#374151;color:white;padding:6px 8px;font-size:9px;text-align:right;white-space:nowrap}
                      th:first-child{text-align:left}
                      tr:nth-child(even){background:#f9fafb}
                      td{border-bottom:1px solid #e5e7eb}
                    </style></head><body>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:2px solid #1f2937;padding-bottom:8px">
                        <div style="font-size:16px;font-weight:900">Nómina — ${MONTHS[month]} ${year}</div>
                        <div style="font-size:10px;color:#6b7280">${activeWithSnap.length} empleados activos · Total: ${fARS(grandTotal)}</div>
                      </div>
                      <table>
                        <thead><tr>
                          <th style="text-align:left">Nombre</th>
                          ${pts.map(pt => `<th>${PAYMENT_META[pt].label}</th>`).join("")}
                          <th>Total ARS</th>
                        </tr></thead>
                        <tbody>${rows}</tbody>
                      </table>
                      <div style="margin-top:16px;border-top:2px solid #1f2937;padding-top:10px">
                        <div style="font-size:11px;font-weight:900;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;color:#374151">Flujos por origen — ${MONTHS[month]} ${year}</div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
                          ${flujos.map(f => `
                            <div style="border:1px solid #e5e7eb;border-radius:6px;padding:10px;border-left:4px solid ${f.color}">
                              <div style="font-size:12px;font-weight:900;color:${f.color};margin-bottom:6px">${f.label}</div>
                              ${f.detail.filter(d => d.val > 0).map(d => `
                                <div style="display:flex;justify-content:space-between;font-size:9px;color:#6b7280;margin-bottom:2px">
                                  <span>${d.label}</span><span>U$ ${Math.round(d.val).toLocaleString("es-AR")}</span>
                                </div>`).join("")}
                              <div style="border-top:1px solid #e5e7eb;margin-top:6px;padding-top:4px;display:flex;justify-content:space-between;font-size:11px;font-weight:900;color:${f.color}">
                                <span>Total</span><span>U$ ${Math.round(f.total).toLocaleString("es-AR")}</span>
                              </div>
                            </div>`).join("")}
                        </div>
                        <div style="background:#1f2937;color:white;border-radius:6px;padding:8px 14px;display:flex;justify-content:space-between;align-items:center">
                          <span style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af">Total USD nómina</span>
                          <span style="font-size:16px;font-weight:900">U$ ${Math.round(totalFlujoUSD).toLocaleString("es-AR")}</span>
                        </div>
                      </div>
                      <div style="margin-top:12px;text-align:right;font-size:9px;color:#9ca3af">KiSP Nómina · Generado ${new Date().toLocaleDateString("es-AR")}</div>
                    </body></html>`);
                    w.document.close();
                    w.onload = () => { w.focus(); w.print(); w.close(); };
                    setTimeout(() => { try { w.focus(); w.print(); } catch(e){} }, 800);
                  }}
                  className="shrink-0 bg-blue-600 text-white px-2 py-2 rounded-lg font-bold hover:bg-blue-700 text-center text-lg leading-none sm:text-sm">
                  <span className="hidden sm:inline">🖨 Reporte</span><span className="sm:hidden">🖨</span>
                </button>
                <button onClick={() => setModal({ mode: "add", data: { name: "", team: "", rank: "", area: "", supervisor: "", activeFrom: "", activeTo: "", dni: "", address: "", personalEmail: "", notes: [], payments: {} } })}
                  className="shrink-0 bg-gray-900 text-white px-2 py-2 rounded-lg font-bold hover:bg-gray-700 text-center text-lg leading-none sm:text-sm">
                  <span className="hidden sm:inline">+ Nuevo</span><span className="sm:hidden">+</span>
                </button>
              </div>
              {/* Row 2: filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="min-w-28 flex-1">
                  <Select value={areaFilter === "All" ? "" : areaFilter} onChange={v => { setAreaFilter(v || "All"); setTeamFilter("All"); setCargoFilter("All"); }} options={areas} placeholder="All áreas" />
                </div>
                <div className="min-w-28 flex-1">
                  <Select value={teamFilter === "All" ? "" : teamFilter} onChange={v => setTeamFilter(v || "All")} options={teamOptions} placeholder="All teams" />
                </div>
                <div className="min-w-28 flex-1">
                  <Select value={cargoFilter === "All" ? "" : cargoFilter} onChange={v => setCargoFilter(v || "All")} options={cargoOptions} placeholder="All cargos" />
                </div>
                <div className="min-w-28 flex-1">
                  <Select value={supervisorFilter === "All" ? "" : supervisorFilter} onChange={v => setSupervisorFilter(v || "All")} options={supervisorOptions} placeholder="All supervisores" />
                </div>
                {payFilter && (
                  <div className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold " + COLOR[PAYMENT_META[payFilter].color].bg + " " + COLOR[PAYMENT_META[payFilter].color].text}>
                    {PAYMENT_META[payFilter].icon} {PAYMENT_META[payFilter].label}
                    <button onClick={() => setPayFilter(null)} className="ml-1 opacity-60 hover:opacity-100 text-sm leading-none">x</button>
                  </div>
                )}
              </div>
            </div>

            {/* active filters banner */}
            {(payFilter || areaFilter !== "All" || supervisorFilter !== "All" || teamFilter !== "All" || cargoFilter !== "All" || search) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-700">{filtered.length} de {activeWithSnap.length} empleados en {MONTHS[month]} {year}</span>
                <div>
                  <span className="font-black text-lg text-blue-900">{fARS(filteredTotal)}</span>
                  {dolar > 0 && <span className="text-gray-400 text-xs ml-2">≈ {fUSD(filteredTotal / dolar)}</span>}
                </div>
              </div>
            )}

            {/* table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm" style={{minWidth:"580px"}}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase">
                      <button onClick={() => setSortField(s => s === "name_asc" ? "name_desc" : "name_asc")} className={"font-medium hover:text-gray-700 " + (sortField?.startsWith("name") ? "text-gray-700" : "text-gray-400")}>
                        Empleado {sortField === "name_asc" ? "↑" : sortField === "name_desc" ? "↓" : ""}
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase">Team / Cargo</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase">Pagos</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium text-xs uppercase">Montos</th>
                    <th className="text-right px-4 py-3 text-xs uppercase">
                      <button onClick={() => setSortField(s => s === "total_desc" ? "total_asc" : "total_desc")} className={"font-medium hover:text-gray-700 " + (sortField?.startsWith("total") ? "text-gray-700" : "text-gray-400")}>
                        Total ARS {sortField === "total_desc" ? "↓" : sortField === "total_asc" ? "↑" : ""}
                      </button>
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {showFuture ? (
                    futureEmployees.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No hay próximos ingresos registrados</td></tr>
                    ) : futureEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-emerald-50 transition-colors bg-emerald-50/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={"w-8 h-8 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                              {initials(emp.name)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 tracking-wide">{emp.name}</div>
                              <div className="text-xs text-gray-400">{emp.team || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{emp.area || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Ingreso: {fDate(emp.activeFrom)}</span>
                        </td>
                        <td colSpan={3} />
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => { if (window.confirm("¿Enviar drafts de onboarding para " + emp.name + "?")) fireOnboardingDrafts(emp); }}
                              className="text-xs px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-100 font-medium"
                              title="Enviar emails de onboarding">
                              ✉️ Emails
                            </button>
                            <button onClick={() => setModal({ data: emp, mode: "edit" })}
                              className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : showInactive ? (
                    inactiveFiltered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">{search ? `Sin inactivos que coincidan con "${search}"` : "No hay empleados inactivos"}</td></tr>
                    ) : inactiveFiltered.map(emp => (
                      <tr key={emp.id} className="hover:bg-red-50 transition-colors bg-red-50/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={"w-8 h-8 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 opacity-60"}>
                              {initials(emp.name)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 tracking-wide">{emp.name}</div>
                              <div className="text-xs text-gray-400">desde {fDate(emp.activeFrom)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{emp.team || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{emp.area || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Baja: {fDate(emp.activeTo)}</span>
                        </td>
                        <td colSpan={2} />
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setModal({ data: emp, mode: "edit" })}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No hay empleados en {MONTHS[month]} {year}</td></tr>
                  )}
                  {sortedFiltered.map(emp => {
                    const total = arsNomina(emp.payments);
                    const empFull = employees.find(e => e.id === emp.id) || emp;
                    const snapCount = empFull.history ? empFull.history.length : 0;
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={"w-8 h-8 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                              {initials(emp.name)}
                            </div>
                            <div>
                              <button onClick={() => setProfileEmp(empFull)}
                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left tracking-wide">
                                {emp.name}
                              </button>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-400">desde {fDate(emp.activeFrom)}</span>
                                {emp.area && <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium">{emp.area}</span>}
                                {emp.activeFrom && (() => {
                                  const years = (new Date() - new Date(emp.activeFrom)) / (1000*60*60*24*365.25);
                                  const y = Math.floor(years);
                                  const m = Math.floor((years - y) * 12);
                                  return <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{y > 0 ? y + "a" : ""}{m > 0 ? " " + m + "m" : ""}</span>;
                                })()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 font-bold text-sm leading-tight">{emp.team}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{emp.rank}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            {PAYMENT_TYPES.filter(pt => emp.payments[pt] > 0).map(pt => {
                              const meta = PAYMENT_META[pt];
                              const cc = COLOR[meta.color];
                              return <span key={pt} className={"px-2 py-0.5 rounded-full text-xs font-semibold border w-fit " + cc.badge + " " + cc.border + (payFilter === pt ? " ring-2 ring-current" : "")}>{meta.label}</span>;
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col gap-1">
                            {emp.payments.ARS > 0        && <div className="text-xs text-blue-700 font-mono py-0.5">{fARS(emp.payments.ARS)}</div>}
                            {emp.payments.Crypto > 0     && <div className="text-xs text-purple-700 font-mono py-0.5">U$ {emp.payments.Crypto.toLocaleString("es-AR")}</div>}
                            {emp.payments.Canada > 0     && <div className="text-xs text-red-700 font-mono py-0.5">U$ {emp.payments.Canada.toLocaleString("es-AR")}</div>}
                            {emp.payments.Healthcare > 0 && <div className="text-xs text-pink-700 font-mono py-0.5">U$ {emp.payments.Healthcare.toLocaleString("es-AR")}</div>}
                            {emp.payments.Allowance > 0  && <div className="text-xs text-yellow-700 font-mono py-0.5">U$ {emp.payments.Allowance.toLocaleString("es-AR")}</div>}
                            {emp.payments.Cash2 > 0      && <div className="text-xs text-green-700 font-mono py-0.5">U$ {emp.payments.Cash2.toLocaleString("es-AR")}</div>}
                            {emp.payments.Bonus > 0      && <div className="text-xs text-teal-700 font-mono py-0.5">U$ {emp.payments.Bonus.toLocaleString("es-AR")}</div>}
                            {(() => { const totalUSD = (emp.payments.Crypto||0)+(emp.payments.Canada||0)+(emp.payments.Healthcare||0)+(emp.payments.Allowance||0)+(emp.payments.Cash2||0)+(emp.payments.Bonus||0); return totalUSD > 0 ? <div className="text-xs text-gray-400 font-mono py-0.5 border-t border-gray-100 mt-0.5 pt-1">U$ {totalUSD.toLocaleString("es-AR")}</div> : null; })()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{fARS(total)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setModal({ mode: "edit", data: { ...empFull, payments: { ...emp.payments }, rank: emp.rank } })}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="Editar">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => {
                                if (window.confirm("¿Borrar permanentemente a " + empFull.name + "? Esta acción no se puede deshacer.")) {
                                  setEmployees(p => p.filter(e => e.id !== empFull.id));
                                  showToast(empFull.name + " eliminado", "warn");
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" title="Borrar permanentemente">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                    </>
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-700">
                      {showInactive
                        ? `${inactiveFiltered.length} empleados inactivos`
                        : `${filtered.length} empleados activos en ${MONTHS[month]} ${year}`}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-gray-900 text-base">{showInactive ? "" : fARS(filteredTotal)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="text-xs text-gray-400 text-center">Toca el nombre de un empleado para ver su historial salarial</div>
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {/* ── RANKING ── */}
        {view === "ranking" && (() => {
          // Apply pre-filters
          const rankFiltered = activeWithSnap.filter(emp => {
            if (rankAreaFilter !== "All" && emp.area !== rankAreaFilter) return false;
            if (rankTeamFilter !== "All" && emp.team !== rankTeamFilter) return false;
            if (rankCargoFilter !== "All" && emp.rank !== rankCargoFilter) return false;
            return true;
          });
          // Available options based on current filters
          const availTeams  = Array.from(new Set(activeWithSnap.filter(e => rankAreaFilter === "All" || e.area === rankAreaFilter).map(e => e.team).filter(Boolean))).sort();
          const availCargos = Array.from(new Set(activeWithSnap.filter(e => (rankAreaFilter === "All" || e.area === rankAreaFilter) && (rankTeamFilter === "All" || e.team === rankTeamFilter)).map(e => e.rank).filter(Boolean))).sort();
          // Group
          const grouped = {};
          rankFiltered.forEach(emp => {
            const total = toARS(emp.payments, dolar);
            const groupKey = rankGroup === "area" ? (emp.area || "Sin área")
                           : rankGroup === "team" ? (emp.team || "Sin team")
                           : (emp.rank || "Sin cargo");
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push({ ...emp, total });
          });
          const sortedGroups = Object.entries(grouped)
            .map(([g, emps]) => ({ g, emps: [...emps].sort((a, b) => b.total - a.total) }))
            .sort((a, b) => b.emps.reduce((s, e) => s + e.total, 0) - a.emps.reduce((s, e) => s + e.total, 0));
          const hasFilters = rankAreaFilter !== "All" || rankTeamFilter !== "All" || rankCargoFilter !== "All";
          return (
            <div className="space-y-3">
              {/* Filter bar */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0">Filtrar</span>
                  <div className="flex-1 min-w-28">
                    <Select value={rankAreaFilter === "All" ? "" : rankAreaFilter}
                      onChange={v => { setRankAreaFilter(v || "All"); setRankTeamFilter("All"); setRankCargoFilter("All"); }}
                      options={areas} placeholder="All áreas" />
                  </div>
                  <div className="flex-1 min-w-28">
                    <Select value={rankTeamFilter === "All" ? "" : rankTeamFilter}
                      onChange={v => { setRankTeamFilter(v || "All"); setRankCargoFilter("All"); }}
                      options={availTeams} placeholder="All teams" />
                  </div>
                  <div className="flex-1 min-w-28">
                    <Select value={rankCargoFilter === "All" ? "" : rankCargoFilter}
                      onChange={v => setRankCargoFilter(v || "All")}
                      options={availCargos} placeholder="All cargos" />
                  </div>
                  {hasFilters && (
                    <button onClick={() => { setRankAreaFilter("All"); setRankTeamFilter("All"); setRankCargoFilter("All"); }}
                      className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 shrink-0">
                      × Limpiar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0">Agrupar por</span>
                  {[["area","Área"],["team","Team"],["rank","Cargo"]].map(([k, label]) => (
                    <button key={k} onClick={() => setRankGroup(k)}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " + (rankGroup === k ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                      style={rankGroup === k ? {background:"#0a4a3a"} : {}}>
                      {label}
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-auto">{rankFiltered.length} empleados · {MONTHS[month]} {year}</span>
                </div>
              </div>
              {/* Groups */}
              {sortedGroups.map(({ g, emps }) => {
                const groupTotal = emps.reduce((s, e) => s + e.total, 0);
                const groupUSD = dolar > 0 ? groupTotal / dolar : 0;
                return (
                  <div key={g} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between" style={{background:"#f0faf5"}}>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm" style={{color:"#0a4a3a"}}>{g}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border">{emps.length} emp.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">USD</div>
                          <div className="text-sm font-bold text-emerald-700">{dolar > 0 ? fUSD(groupUSD) : "—"}</div>
                        </div>
                        <div className="w-px h-8 bg-green-200" />
                        <div className="text-right">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">ARS</div>
                          <div className="text-sm font-bold text-gray-800">{fARS(groupTotal)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {emps.map((emp, idx) => (
                        <div key={emp.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setProfileEmp(employees.find(e => e.id === emp.id))}>
                          <span className={"text-xs font-black w-6 text-right shrink-0 " + (idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-600" : "text-gray-300")}>
                            #{idx + 1}
                          </span>
                          <div className={"w-7 h-7 " + avatarColor(emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                            {initials(emp.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{emp.name}</div>
                            <div className="text-xs text-gray-400 truncate">
                              {rankGroup !== "team" && emp.team && <span>{emp.team} · </span>}
                              {rankGroup !== "rank" && <span className="italic">{emp.rank}</span>}
                              {rankGroup !== "area" && emp.area && <span> · {emp.area}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-xs text-gray-400 uppercase tracking-wide">USD</div>
                              <div className="text-sm font-bold text-emerald-700">{dolar > 0 && emp.total > 0 ? fUSD(emp.total / dolar) : "—"}</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                            <div className="text-right">
                              <div className="text-xs text-gray-400 uppercase tracking-wide">ARS</div>
                              <div className="text-sm font-bold text-gray-800">{fARS(emp.total)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {sortedGroups.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
                  Sin resultados para los filtros seleccionados
                </div>
              )}
            </div>
          );
        })()}

        {/* ── COMPARAR ── */}
        {view === "comparar" && (() => {
          // Difference bar
          const totalA = cmpA ? arsNomina(cmpA.payments) : 0;
          const totalB = cmpB ? arsNomina(cmpB.payments) : 0;
          const maxT = Math.max(totalA, totalB, 1);
          const diff = totalA - totalB;
          const diffUSD = dolar > 0 ? diff / dolar : 0;

          return (
            <div className="space-y-4">
              {/* Selector panels */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch">
                <CmpPanel emp={cmpA} search={cmpSearchA} setSearch={setCmpSearchA} setEmp={setCmpA} label="Empleado A" allEmps={activeWithSnap} dolar={dolar} dolarCrypto={dolarCrypto} useNominaCrypto={useNominaCrypto} month={month} year={year} />
                {/* VS divider */}
                <div className="flex lg:flex-col flex-row items-center justify-center shrink-0 gap-2">
                  <div className="lg:w-px lg:h-auto lg:flex-1 h-px w-full flex-1 bg-gray-200"/>
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-gray-400">VS</div>
                  <div className="lg:w-px lg:h-auto lg:flex-1 h-px w-full flex-1 bg-gray-200"/>
                </div>
                <CmpPanel emp={cmpB} search={cmpSearchB} setSearch={setCmpSearchB} setEmp={setCmpB} label="Empleado B" allEmps={activeWithSnap} dolar={dolar} dolarCrypto={dolarCrypto} useNominaCrypto={useNominaCrypto} month={month} year={year} />
              </div>

              {/* Comparison result */}
              {cmpA && cmpB && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Comparación · {MONTHS[month]} {year}</div>
                  {/* Bar chart */}
                  <div className="space-y-2">
                    {[{emp: cmpA, total: totalA, label: "A"}, {emp: cmpB, total: totalB, label: "B"}].map(({emp, total, label}) => (
                      <div key={emp.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-700 truncate">{emp.name}</span>
                          <div className="text-right shrink-0 ml-2">
                            <span className="font-black text-gray-900">{fARS(total)}</span>
                            {dolar > 0 && <span className="text-gray-400 ml-1">{fUSD(total/dolar)}</span>}
                          </div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{width: (total/maxT*100)+'%', background: label==="A" ? "#0a4a3a" : "#3b82f6"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Difference */}
                  <div className={"rounded-xl p-3 text-sm " + (diff === 0 ? "bg-gray-50 border border-gray-100" : diff > 0 ? "bg-green-50 border border-green-100" : "bg-blue-50 border border-blue-100")}>
                    {diff === 0
                      ? <span className="text-gray-600 font-semibold">Sueldos idénticos</span>
                      : <>
                          <span className="font-black" style={{color: diff > 0 ? "#0a4a3a" : "#1d4ed8"}}>{diff > 0 ? cmpA.name.split(' ')[0] : cmpB.name.split(' ')[0]}</span>
                          <span className="text-gray-600"> cobra </span>
                          <span className="font-black" style={{color: diff > 0 ? "#0a4a3a" : "#1d4ed8"}}>{fARS(Math.abs(diff))}</span>
                          <span className="text-gray-600"> más</span>
                          {dolar > 0 && <span className="text-gray-400 text-xs ml-1">({fUSD(Math.abs(diffUSD))})</span>}
                        </>
                    }
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {view === "historial" && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {YEARS.map(y => {
                // Para el año actual o futuro, usar el último mes con datos; sino junio
                const now = new Date();
                const lastMonth = y === now.getFullYear()
                  ? (() => {
                      for (let m = now.getMonth() - 1; m >= 0; m--) {
                        const emps = employees.filter(e => isActiveInMonth(e, y, m));
                        if (emps.length > 0) return m;
                      }
                      return 0;
                    })()
                  : 6;
                const refLabel = MONTHS[lastMonth].slice(0,3).toLowerCase();
                const empsY = employees.filter(e => isActiveInMonth(e, y, lastMonth));
                const d6 = dolarMap[mkey(y, lastMonth)] || 0;
                const tot = empsY.reduce((s, e) => { const snap = snapshotAt(e, mkey(y, lastMonth) + "-15"); return s + toCosto(snap ? snap.payments : {}, d6, cargaSocial); }, 0);
                const totUSD = d6 > 0 ? tot / d6 : 0;
                return (
                  <button key={y} onClick={() => setYear(y)}
                    className={"rounded-xl p-2 border text-center transition-all hover:shadow-md " + (y === year ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 hover:border-gray-400")}>
                    <div className={"text-base font-black " + (y === year ? "text-white" : "text-gray-800")}>{y}</div>
                    <div className={"text-xs mt-0.5 " + (y === year ? "text-gray-300" : "text-gray-400")}>{empsY.length}p</div>
                    <div className={"text-xs mt-0.5 " + (y === year ? "text-gray-400" : "text-gray-400")}>{empsY.length > 0 && totUSD > 0 ? fUSD(totUSD / empsY.length) + "/p" : "—"}</div>
                  </button>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="font-semibold text-gray-800">Mes a mes — {year}</div>
                <div className="text-xs text-gray-400">Click en un mes para ir a la nomina</div>
              </div>
              <table className="w-full text-sm" style={{minWidth:"520px"}}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs uppercase">Mes</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium text-xs uppercase">Dolar Blue</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium text-xs uppercase">Empleados</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium text-xs uppercase">Total ARS</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium text-xs uppercase">USD</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium text-xs uppercase">Var.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MONTHS.map((m, i) => {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth();
                    if (year === currentYear && i > currentMonth) return null; // no mostrar meses futuros
                    const k = mkey(year, i);
                    const d = dolarMap[k] || 0;
                    const emps = employees.filter(e => isActiveInMonth(e, year, i));
                    const tot = emps.reduce((s, e) => { const snap = snapshotAt(e, k + "-15"); return s + toARS(snap ? snap.payments : {}, d); }, 0);
                    let pct = null;
                    if (i > 0) {
                      const pk = mkey(year, i - 1);
                      const pd = dolarMap[pk] || 0;
                      const pe = employees.filter(e => isActiveInMonth(e, year, i - 1));
                      const pt2 = pe.reduce((s, e) => { const snap = snapshotAt(e, pk + "-15"); return s + toARS(snap ? snap.payments : {}, pd); }, 0);
                      if (pt2 > 0) pct = ((tot - pt2) / pt2) * 100;
                    }
                    const isCur = i === month && year === year;
                    return (
                      <tr key={i} onClick={() => { setMonth(i); setView("nomina"); setPayFilter(null); }}
                        className={"cursor-pointer hover:bg-blue-50 transition-colors " + (isCur ? "bg-blue-50 font-semibold" : "")}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {isCur && <span className="text-blue-500 text-xs">{'>'}</span>}
                            {m}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-emerald-700 font-semibold">{d > 0 ? "$" + d.toLocaleString("es-AR") : "—"}</td>
                        <td className="px-5 py-3 text-right">{emps.length}</td>
                        <td className="px-5 py-3 text-right font-semibold">{tot > 0 ? fARS(tot) : "—"}</td>
                        <td className="px-5 py-3 text-right text-gray-500 font-mono">{d > 0 && tot > 0 ? fUSD(tot / d) : "—"}</td>
                        <td className="px-5 py-3 text-right">
                          {pct != null
                            ? <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + (pct > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                                {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
                              </span>
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BONOS ── */}
        {view === "bonos" && (() => {
          const allBonuses = employees
            .flatMap(e => (e.bonusHistory || []).map(b => ({ emp: e, month: b.month, amount: b.amount })))
            .sort((a, b) => b.month.localeCompare(a.month));
          const grouped = {};
          allBonuses.forEach(b => { if (!grouped[b.month]) grouped[b.month] = []; grouped[b.month].push(b); });
          const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
          return (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Historial de Bonos</h2>
                <span className="text-sm text-gray-400">{allBonuses.length} bono{allBonuses.length !== 1 ? "s" : ""} registrados</span>
              </div>
              {allBonuses.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">No hay bonos registrados aún.</div>
              )}
              {months.map(m => {
                const items = grouped[m];
                const total = items.reduce((s, b) => s + b.amount, 0);
                return (
                  <div key={m} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-teal-50 border-b border-teal-100">
                      <span className="font-bold text-teal-800">{MONTHS[parseInt(m.slice(5,7))-1]} {m.slice(0,4)}</span>
                      <span className="text-sm font-semibold text-teal-700">Total: U$ {total.toLocaleString("es-AR")}</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                          <th className="text-left px-5 py-2 font-medium">Empleado</th>
                          <th className="text-left px-5 py-2 font-medium">Área</th>
                          <th className="text-right px-5 py-2 font-medium">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((b, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setProfileEmp(employees.find(e => e.id === b.emp.id))}>
                            <td className="px-5 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className={"w-6 h-6 " + avatarColor(b.emp.id) + " rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"}>{initials(b.emp.name)}</div>
                                <span className="font-medium text-gray-800">{b.emp.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-2.5 text-gray-400">{b.emp.area}</td>
                            <td className="px-5 py-2.5 text-right font-mono font-semibold text-teal-700">U$ {b.amount.toLocaleString("es-AR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ── CONFIG ── */}
        {view === "config" && (
          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm text-blue-700">
              Al renombrar un item, todos los empleados se actualizan automáticamente.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ConfigList title="Teams" icon="👥" items={teams} onUpdate={(updated, oldVal, newVal) => {
                setTeams(updated);
                if (oldVal && newVal) setEmployees(p => p.map(e => e.team === oldVal ? { ...e, team: newVal } : e));
                showToast("Teams actualizados");
              }} usedCount={item => employees.filter(e => e.team === item).length} />
              <ConfigList title="Cargos" icon="🏷️" items={ranks} onUpdate={(updated, oldVal, newVal) => {
                setRanks(updated);
                if (oldVal && newVal) setEmployees(p => p.map(e => ({ ...e, history: e.history.map(s => s.rank === oldVal ? { ...s, rank: newVal } : s) })));
                showToast("Cargos actualizados");
              }} usedCount={item => employees.reduce((c, e) => c + e.history.filter(s => s.rank === item).length, 0)} />
              <ConfigList title="Áreas" icon="🗂️" items={areas} onUpdate={(updated, oldVal, newVal) => {
                setAreas(updated);
                if (oldVal && newVal) setEmployees(p => p.map(e => e.area === oldVal ? { ...e, area: newVal } : e));
                showToast("Áreas actualizadas");
              }} usedCount={item => employees.filter(e => e.area === item).length} />
              <ConfigList title="Supervisores" icon="👤" items={Array.from(new Set(employees.filter(e => e.supervisor).map(e => e.supervisor))).sort()} onUpdate={(updated, oldVal, newVal) => {
                if (oldVal && newVal) setEmployees(p => p.map(e => e.supervisor === oldVal ? { ...e, supervisor: newVal } : e));
                showToast("Supervisores actualizados");
              }} usedCount={item => employees.filter(e => e.supervisor === item).length} readOnly />
            </div>

            {/* EMAIL TEMPLATES */}
            <EmailTemplatesConfig emailTemplates={emailTemplates} setEmailTemplates={setEmailTemplates} fillTemplate={fillTemplate} />
          </div>
        )}
      </div>

      {/* MODALS */}
      {profileEmp && (
        <EmployeeProfile
          emp={employees.find(e => e.id === profileEmp.id) || profileEmp}
          dolarMap={dolarMap}
          dolarCryptoMap={dolarCryptoMap}
          ipcMap={ipcMap}
          ranks={ranks}
          onClose={() => setProfileEmp(null)}
          onSaveHistory={saveHistory}
          onSaveNotes={saveNotes}
          onPrint={(emp, chartData, rangeFrom, rangeTo) => { setProfileEmp(null); setPrintData({ emp, chartData, year, month, rangeFrom, rangeTo }); }}
        />
      )}

      {printData && (
        <PrintPreview
          emp={printData.emp}
          dolarMap={dolarMap}
          ipcMap={ipcMap}
          ranks={ranks}
          chartData={printData.chartData}
          year={printData.year}
          month={printData.month}
          rangeFrom={printData.rangeFrom}
          rangeTo={printData.rangeTo}
          onClose={() => setPrintData(null)}
        />
      )}

      {modal && (
        <EmployeeModal
          data={modal.data}
          mode={modal.mode}
          teams={teams}
          ranks={ranks}
          areas={areas}
          supervisors={[...new Set(employees.map(e => e.name).filter(Boolean))].sort()}
          currentKey={key}
          onSave={saveEmployee}
          onClose={() => setModal(null)}
        />
      )}

      {/* DRAFT NOTIFICATION */}
      {draftNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4 max-w-md w-full mx-4">
          <span className="text-2xl">✉️</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold">Borrador creado en Gmail</div>
            <div className="text-xs text-gray-400 truncate">To: {draftNotification.to}</div>
            <div className="text-xs text-gray-400 truncate">{draftNotification.subject}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={draftNotification.url} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{background:"#1a7a5e"}}>
              Ver Draft
            </a>
            <button onClick={() => setDraftNotification(null)}
              className="text-gray-400 hover:text-white text-lg leading-none px-1">×</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONFIG LIST ───────────────────────────────────────────────────────────────
function ConfigList({ title, icon, items, onUpdate, usedCount, readOnly }) {
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [adding, setAdding]   = useState(false);
  const [newVal, setNewVal]   = useState("");
  const [confirm, setConfirm] = useState(null);

  function startEdit(i) { setEditing(i); setEditVal(items[i]); setConfirm(null); }
  function saveEdit(i) {
    const v = editVal.trim();
    if (!v || items.some((x, j) => x === v && j !== i)) { setEditing(null); return; }
    const u = [...items]; u[i] = v;
    onUpdate(u, items[i], v);
    setEditing(null);
  }
  function del(i) { onUpdate(items.filter((_, j) => j !== i), items[i], null); setConfirm(null); }
  function add() {
    const v = newVal.trim();
    if (!v || items.includes(v)) return;
    onUpdate([...items, v], null, v);
    setNewVal(""); setAdding(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="font-bold text-gray-800">{title}</div>
            <div className="text-xs text-gray-400">{items.length} en total</div>
          </div>
        </div>
        {!readOnly && <button onClick={() => { setAdding(true); setEditing(null); setConfirm(null); }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700">
          + Agregar
        </button>}
      </div>
      {!readOnly && adding && (
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200 flex gap-2 items-center">
          <input autoFocus className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
            placeholder="Nombre..." value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") { setAdding(false); setNewVal(""); } }} />
          <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">ok</button>
          <button onClick={() => { setAdding(false); setNewVal(""); }} className="px-3 py-2 text-gray-500 text-sm">x</button>
        </div>
      )}
      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
        {items.map((item, i) => {
          const cnt = usedCount(item);
          return (
            <div key={i} className="px-5 py-2.5 flex items-center gap-3 hover:bg-gray-50 group">
              {editing === i ? (
                <>
                  <input autoFocus className="flex-1 border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    value={editVal} onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(i); if (e.key === "Escape") setEditing(null); }} />
                  <button onClick={() => saveEdit(i)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">ok</button>
                  <button onClick={() => setEditing(null)} className="px-2 text-gray-400 text-xs">x</button>
                </>
              ) : confirm === i ? (
                <>
                  <span className="flex-1 text-sm text-red-600 font-medium">Eliminar <strong>{item}</strong>?{cnt > 0 ? " (" + cnt + " asignados)" : ""}</span>
                  <button onClick={() => del(i)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold">Eliminar</button>
                  <button onClick={() => setConfirm(null)} className="px-2 text-gray-400 text-xs">x</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 font-medium">{item}</span>
                  {cnt > 0 && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cnt}</span>}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 text-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setConfirm(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 text-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EMPLOYEE MODAL ────────────────────────────────────────────────────────────
function CmpPanel({ emp, search, setSearch, setEmp, label, allEmps, dolar, dolarCrypto, useNominaCrypto, month, year }) {
  const PAY_LABELS = { ARS:'ARS', Crypto:'USDT', Canada:'Canada USD', Healthcare:'Healthcare USD', Allowance:'Allowance USD', Cash2:'Cash 2 USD', Bonus:'Bonus USD', Mono:'Monotributo BA' };
  const types = ['ARS','Crypto','Canada','Healthcare','Allowance','Cash2','Bonus','Monotributo'];
  const results = search.length >= 2
    ? allEmps.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];
  const total = emp ? (useNominaCrypto ? toARSProfile(emp.payments, dolar, dolarCrypto) : toARS(emp.payments, dolar)) : 0;
  const usd   = dolar > 0 && total > 0 ? total / dolar : 0;
  const payments = emp ? emp.payments : {};
  const fARS2 = v => '$' + Math.round(v).toLocaleString('es-AR');
  const fUSD2 = v => 'U$' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between" style={{background:"#f0faf5"}}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{color:"#0a4a3a"}}>{label}</span>
        {emp && <button onClick={() => { setEmp(null); setSearch(""); }} className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">× Cambiar</button>}
      </div>
      {!emp ? (
        <div className="p-3 flex-1">
          <input
            className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-green-400 mb-2"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
          {results.length > 0 && (
            <div className="space-y-0.5">
              {results.map(e => (
                <div key={e.id} onClick={() => { setEmp(e); setSearch(""); }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className={"w-6 h-6 " + avatarColor(e.id) + " rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                    {initials(e.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">{e.name}</div>
                    <div className="text-xs text-gray-400 truncate">{e.area}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {search.length >= 2 && results.length === 0 && <div className="text-xs text-gray-400 text-center py-4">Sin resultados</div>}
          {search.length < 2 && <div className="text-xs text-gray-300 text-center py-4">Escribí al menos 2 letras</div>}
        </div>
      ) : (
        <div className="p-2.5 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className={"w-8 h-8 " + avatarColor(emp.id) + " rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"}>{initials(emp.name)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-gray-900 truncate">{emp.name}</div>
              <div className="text-xs text-gray-400 truncate">{emp.rank || emp.area}</div>
            </div>
          </div>
          <div className="rounded-lg px-2.5 py-1.5 border border-gray-100 overflow-hidden" style={{background:"#f0faf5"}}>
            <div className="text-lg font-black text-gray-900 break-all leading-tight">{fARS2(total)}</div>
            {dolar > 0 && <div className="text-xs text-gray-500">{fUSD2(usd)}</div>}
          </div>
          <div className="space-y-1">
            {types.filter(t => payments[t]).map(t => {
              const isUSD = t !== 'ARS' && t !== 'Monotributo';
              const raw = payments[t];
              const trunkIsCrypto = (payments['Crypto'] || 0) > 0;
              const isCryptoRate = t === 'Crypto' || ((t === 'Healthcare' || t === 'Allowance') && trunkIsCrypto);
              const rateForType = (useNominaCrypto && isCryptoRate) ? dolarCrypto : dolar;
              const inARS = isUSD ? raw * rateForType : raw;
              return (
                <div key={t} className="flex flex-col text-xs">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-gray-400 truncate">{PAY_LABELS[t]}</span>
                    <span className="font-medium text-gray-700 break-all text-right">{isUSD ? fUSD2(raw) : fARS2(raw)}</span>
                  </div>
                  {isUSD && dolar > 0 && (
                    <div className="text-right text-gray-400">{fARS2(inARS)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EmailTemplatesConfig({ emailTemplates, setEmailTemplates, fillTemplate }) {
  const [expanded, setExpanded] = React.useState({});
  const labels = { salesSupport: "Sales Support → Antonella", cad: "CAD → Mariela, Andrea, Silvana", crypto: "Crypto payment → Mary, Eliana, Rob", monotributo: "Monotributo → Ezequiel", dependencia: "Relación de Dependencia → Ezequiel", cash2Change: "Cash 2 change → Ezequiel + Rob", bonusChange: "Bonus change → Ezequiel + Rob", cryptoChange: "Crypto salary change → Mary + Rob", canadaNew: "Canada New → Mary + Rob", cryptoToCanada: "USD from Canada → Mary + Rob", resignation: "Resignation → Mary" };
  const colors = { salesSupport: "#7e22ce", cad: "#1d4ed8", crypto: "#b45309", monotributo: "#166534", dependencia: "#15803d", cash2Change: "#0e7490", bonusChange: "#be185d", cryptoChange: "#854d0e", cryptoToCanada: "#dc2626", resignation: "#991b1b" };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{background:"#f0faf5"}}>
        <span className="text-base">✉️</span>
        <span className="font-bold text-sm" style={{color:"#0a4a3a"}}>Email Templates — Onboarding</span>
        <span className="text-xs text-gray-400 ml-2">Se disparan automáticamente al agregar un empleado</span>
      </div>
      <div className="divide-y divide-gray-100">
        {Object.entries(emailTemplates).map(([key, tmpl]) => {
          const isOpen = !!expanded[key];
          const color = colors[key] || "#6b7280";
          return (
            <div key={key}>
              {/* Collapsed row */}
              <div
                className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))}>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0"
                  style={{background: color+'18', color, fontSize:"10px"}}>{labels[key] || key}</span>
                <span className="text-xs text-gray-300 shrink-0">{isOpen ? '▲' : '▼'}</span>
              </div>
              {/* Expanded editor */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">To</label>
                      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                        value={tmpl.to}
                        onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], to: e.target.value } }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CC</label>
                      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                        value={tmpl.cc}
                        onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], cc: e.target.value } }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subject</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                      value={tmpl.subject}
                      onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], subject: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Body</label>
                    <textarea rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 font-mono resize-y bg-white"
                      value={tmpl.body}
                      onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], body: e.target.value } }))} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TRUNKS = ["Crypto","Canada","Mono","ARS"];
const TRUNK_LABELS = { Crypto:"USDT", Canada:"Canada USD", Mono:"Monotributo BA", ARS:"Pesos ARS" };
const TRUNK_COLORS = {
  Crypto: { sel:"bg-purple-600 text-white border-purple-600", unsel:"bg-white text-purple-700 border-purple-200 hover:bg-purple-50", bg:"bg-purple-50", text:"text-purple-700", border:"border-purple-200" },
  Canada: { sel:"bg-red-600 text-white border-red-600",       unsel:"bg-white text-red-700 border-red-200 hover:bg-red-50",         bg:"bg-red-50",    text:"text-red-700",    border:"border-red-200"    },
  Mono:   { sel:"bg-green-600 text-white border-green-600",   unsel:"bg-white text-green-700 border-green-200 hover:bg-green-50",   bg:"bg-green-50",  text:"text-green-700",  border:"border-green-200"  },
  ARS:    { sel:"bg-blue-600 text-white border-blue-600",     unsel:"bg-white text-blue-700 border-blue-200 hover:bg-blue-50",     bg:"bg-blue-50",   text:"text-blue-700",   border:"border-blue-200"   },
};
const ITEMS = [
  { key:"Healthcare", label:"Healthcare", unit:"USD", color:"pink",   note:"Sigue el troncal", notARS:true },
  { key:"Allowance",  label:"Allowance",  unit:"USD", color:"yellow", note:"Sigue el troncal", noteARS:"USD Buenos Aires" },
  { key:"Cash2",      label:"Cash 2",     unit:"USD", color:"green",  note:"Siempre BsAs" },
];

function EmployeeModal({ data, mode, teams, ranks, areas, supervisors, currentKey, onSave, onClose }) {
  // Initialize payments from history snapshot at today (avoids corrupted top-level payments)
  const _initPayments = (() => {
    if (data.history && data.history.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const sorted = [...data.history].sort((a, b) => a.from.localeCompare(b.from));
      let snap = sorted[0];
      for (const s of sorted) { if (s.from <= today) snap = s; }
      if (snap && Object.values(snap.payments || {}).some(v => v > 0)) {
        const { Bonus, ...snapPay } = snap.payments || {};
        return snapPay;
      }
    }
    return { ...(data.payments || {}) };
  })();
  const _initRank = (() => {
    if (data.rank) return data.rank;
    if (data.history && data.history.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const sorted = [...data.history].sort((a, b) => a.from.localeCompare(b.from));
      let snap = sorted[0];
      for (const s of sorted) { if (s.from <= today) snap = s; }
      return snap?.rank || "";
    }
    return "";
  })();
  // Init bonus from bonusHistory for the currently viewed month only
  const _initBonus = (() => {
    const entry = (data.bonusHistory || []).find(b => b.month === currentKey);
    return { amount: entry ? entry.amount : 0, month: entry ? entry.month : "" };
  })();
  const [f, setF] = useState({ ...data, rank: _initRank, payments: _initPayments, bonusAmount: _initBonus.amount, bonusMonth: _initBonus.month });
  const [applyNextMonth, setApplyNextMonth] = useState(true);
  const [selectedTrunk, setSelectedTrunk] = useState(
    TRUNKS.find(t => (_initPayments[t] || 0) > 0) || null
  );
  function setPay(pt, v) { setF(p => ({ ...p, payments: { ...p.payments, [pt]: Number(v) || 0 } })); }
  function chooseTrunk(t) {
    setSelectedTrunk(t);
    setF(p => {
      const newPayments = { ...p.payments };
      const oldAmount = TRUNKS.reduce((acc, tr) => tr !== t ? (newPayments[tr] || acc) : acc, 0);
      TRUNKS.forEach(tr => { if (tr !== t) newPayments[tr] = 0; });
      if (!newPayments[t]) newPayments[t] = oldAmount;
      if (t === "ARS") newPayments.Healthcare = 0;
      return { ...p, payments: newPayments };
    });
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col mx-2" style={{maxHeight:"88vh"}}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="font-bold text-lg">{mode === "edit" ? "Editar empleado" : "Nuevo empleado"}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">x</button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre completo</label>
            <input 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              style={{textTransform:"uppercase"}}
              value={f.name} 
              onChange={e => setF(p => ({ ...p, name: e.target.value.toUpperCase() }))} 
              placeholder="EJ: JUAN RODRIGUEZ" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">DNI / Documento</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={f.dni || ""} onChange={e => setF(p => ({ ...p, dni: e.target.value }))} placeholder="Ej: 30123456" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección física</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={f.address || ""} onChange={e => setF(p => ({ ...p, address: e.target.value }))} placeholder="Ej: Av. Corrientes 1234" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email personal</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={f.personalEmail || ""} onChange={e => setF(p => ({ ...p, personalEmail: e.target.value }))} placeholder="Ej: juan@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Área</label>
            <Select value={f.area || ""} onChange={v => setF(p => ({ ...p, area: v, rank: "", team: "" }))} options={areas} placeholder="Seleccionar área" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Supervisor</label>
            <input list="supervisors-list" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={f.supervisor || ""} onChange={e => setF(p => ({ ...p, supervisor: e.target.value }))} placeholder="Buscar supervisor..." />
            <datalist id="supervisors-list">
              {(supervisors || []).map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Team</label>
              <Select key={"team-"+f.area} value={f.team} onChange={v => setF(p => ({ ...p, team: v }))} options={f.area && DATA_BY_AREA[f.area] ? DATA_BY_AREA[f.area].teams : teams} placeholder="Seleccionar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cargo</label>
              <Select key={"cargo-"+f.area} value={f.rank} onChange={v => setF(p => ({ ...p, rank: v }))} options={f.area && DATA_BY_AREA[f.area] ? DATA_BY_AREA[f.area].cargos : ranks} placeholder="Seleccionar" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Activo desde</label>
              <DateInput className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={f.activeFrom || ""} onChange={v => setF(p => ({ ...p, activeFrom: v }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hasta (opcional)</label>
              <div className="flex items-center gap-1">
                <DateInput className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  value={f.activeTo || ""} onChange={v => setF(p => ({ ...p, activeTo: v }))} />
                {f.activeTo && <button type="button" onClick={() => setF(p => ({ ...p, activeTo: "" }))}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none px-1" title="Borrar fecha de baja">×</button>}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Troncal de pago</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {TRUNKS.map(t => (
                <button key={t} type="button" onClick={() => chooseTrunk(t)}
                  className={"px-3 py-2 rounded-lg border text-xs font-bold transition-colors " + (selectedTrunk === t ? TRUNK_COLORS[t].sel : TRUNK_COLORS[t].unsel)}>
                  {TRUNK_LABELS[t]}
                </button>
              ))}
            </div>
            {selectedTrunk && (
              <div className={"flex items-center gap-3 p-2.5 rounded-xl mb-4 " + TRUNK_COLORS[selectedTrunk].bg}>
                <span className={"flex-1 text-xs font-semibold " + TRUNK_COLORS[selectedTrunk].text}>{TRUNK_LABELS[selectedTrunk]}</span>
                <input type="number" placeholder="0"
                  className={"w-32 border " + TRUNK_COLORS[selectedTrunk].border + " rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"}
                  value={f.payments[selectedTrunk] || ""} onChange={e => setPay(selectedTrunk, e.target.value)} />
                <span className={"text-xs opacity-60 w-8 " + TRUNK_COLORS[selectedTrunk].text}>{selectedTrunk === "ARS" || selectedTrunk === "Mono" ? "ARS" : "USD"}</span>
              </div>
            )}
            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Adicionales</div>
            <div className="space-y-2">
              {ITEMS.map(item => {
                if (item.notARS && selectedTrunk === "ARS") return null;
                const cc = COLOR[item.color] || COLOR.green;
                return (
                  <React.Fragment key={item.key}>
                    <div className={"flex items-center gap-3 p-2.5 rounded-xl " + cc.bg}>
                      <div className="flex-1 min-w-0">
                        <span className={"text-xs font-semibold " + cc.text}>{item.label}</span>
                        <span className="text-xs text-gray-400 ml-1.5">{selectedTrunk === "ARS" && item.noteARS ? item.noteARS : item.note}</span>
                      </div>
                      <input type="number" placeholder="0"
                        className={"w-24 border " + cc.border + " rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"}
                        value={f.payments[item.key] || ""} onChange={e => {
                          setPay(item.key, e.target.value);
                          if (item.key === "Bonus" && (!e.target.value || Number(e.target.value) === 0)) {
                            setF(p => ({ ...p, bonusMonth: "" }));
                          }
                        }} />
                      <span className={"text-xs opacity-60 w-8 " + cc.text}>{item.unit}</span>
                    </div>
                    {item.key === "Bonus" && (f.payments.Bonus > 0) && (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-teal-50 border border-teal-100 -mt-1">
                        <span className="text-xs text-teal-600 flex-1">Mes que aplica</span>
                        <input type="month"
                          className="border border-teal-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none text-teal-700"
                          value={f.bonusMonth || ""}
                          onChange={e => setF(p => ({ ...p, bonusMonth: e.target.value }))} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Bonus section — completely separate from salary payments */}
            <div className="border border-teal-200 rounded-xl p-3 bg-teal-50 space-y-2 mt-2">
              <div className="text-xs font-bold text-teal-700 uppercase">Bono puntual</div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-teal-600 w-16 shrink-0">Monto USD</span>
                <input type="number" placeholder="0"
                  className="w-28 border border-teal-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                  value={f.bonusAmount || ""}
                  onChange={e => {
                    const v = Number(e.target.value) || 0;
                    setF(p => ({ ...p, bonusAmount: v, bonusMonth: v === 0 ? "" : p.bonusMonth }));
                  }} />
                <span className="text-xs text-teal-500">USD</span>
              </div>
              {(f.bonusAmount > 0) && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-teal-600 w-16 shrink-0">Mes que aplica</span>
                  <input type="month"
                    className="border border-teal-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none text-teal-700"
                    value={f.bonusMonth || ""}
                    onChange={e => setF(p => ({ ...p, bonusMonth: e.target.value }))} />
                </div>
              )}
              {(f.bonusAmount > 0 && !f.bonusMonth) && (
                <p className="text-xs text-amber-600">⚠️ Elegí el mes que aplica</p>
              )}
            </div>
          </div>
        </div>
        {(() => {
          const totalUSD = (f.payments.Crypto||0)+(f.payments.Canada||0)+(f.payments.Healthcare||0)+(f.payments.Allowance||0)+(f.payments.Cash2||0);
          return totalUSD > 0 ? (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Total USD</span>
                <span className="text-lg font-semibold text-gray-400">U$ {totalUSD.toLocaleString("es-AR")}</span>
              </div>
            </div>
          ) : null;
        })()}
        {mode === "edit" && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
            <span className="text-xs text-gray-400">Aplicar cambio en</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
              <button type="button" onClick={() => setApplyNextMonth(false)}
                className={"px-3 py-1.5 transition-colors " + (!applyNextMonth ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50")}>
                Mes actual
              </button>
              <button type="button" onClick={() => setApplyNextMonth(true)}
                className={"px-3 py-1.5 transition-colors " + (applyNextMonth ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50")}>
                Mes que viene
              </button>
            </div>
          </div>
        )}
        <div className="p-4 border-t border-gray-200 flex gap-3 justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
          {mode === "add" && !f.activeFrom && (
            <span className="text-xs text-red-500 font-medium self-center">⚠️ Falta fecha de inicio</span>
          )}
          <button onClick={() => onSave(f, applyNextMonth)} disabled={!f.name.trim() || (mode === "add" && !f.activeFrom)}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 disabled:opacity-40">
            {mode === "edit" ? "Guardar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
