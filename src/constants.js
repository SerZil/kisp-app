export const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
export const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const YEARS = [2022,2023,2024,2025,2026];
export const CAD_TO_USD = 0.74;
export const AREAS = ["CAD","VISUALIZATIONS","SALES SUPPORT","DEVELOPERS","DATA CREATION","MANAGEMENT","KiTS"];

export const PAYMENT_TYPES = ["ARS","Crypto","Canada","Healthcare","Allowance","Cash2","Bonus","Mono"];
export const PAYMENT_META = {
  ARS:        { label:"Pesos ARS",   unit:"ARS",  color:"blue",   prefix:"$"   },
  Crypto:     { label:"USDT",        unit:"USD",  color:"purple", prefix:"U$"  },
  Canada:     { label:"CAN USD",     unit:"USD",  color:"red",    prefix:"U$"  },
  Healthcare: { label:"Healthcare",  unit:"USD",  color:"pink",   prefix:"U$"  },
  Allowance:  { label:"Allowance",   unit:"USD",  color:"yellow", prefix:"U$"  },
  Cash2:      { label:"Cash 2",      unit:"USD",  color:"green",  prefix:"U$"  },
  Bonus:      { label:"Bonus",       unit:"USD",  color:"teal",   prefix:"U$"  },
  Mono:       { label:"Monotributo",  unit:"ARS",  color:"green",  prefix:"$"   },
};

export const COLOR = {
  blue:   { bg:"bg-blue-50",   border:"border-blue-200",   text:"text-blue-700",   badge:"bg-blue-100 text-blue-700"   },
  purple: { bg:"bg-purple-50", border:"border-purple-200", text:"text-purple-700", badge:"bg-purple-100 text-purple-700"},
  red:    { bg:"bg-red-50",    border:"border-red-200",    text:"text-red-700",    badge:"bg-red-100 text-red-700"     },
  pink:   { bg:"bg-pink-50",   border:"border-pink-200",   text:"text-pink-700",   badge:"bg-pink-100 text-pink-700"   },
  yellow: { bg:"bg-yellow-50", border:"border-yellow-200", text:"text-yellow-700", badge:"bg-yellow-100 text-yellow-700"},
  green:  { bg:"bg-green-50",  border:"border-green-200",  text:"text-green-700",  badge:"bg-green-100 text-green-700" },
  teal:   { bg:"bg-teal-50",   border:"border-teal-200",   text:"text-teal-700",   badge:"bg-teal-100 text-teal-700"   },
};

export const RANK_COLORS = [
  "bg-gray-100 text-gray-600","bg-sky-100 text-sky-700","bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700","bg-violet-100 text-violet-700","bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700","bg-rose-100 text-rose-700","bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700","bg-pink-100 text-pink-700","bg-emerald-100 text-emerald-700",
];

export const AVATAR_COLORS = ["bg-slate-600","bg-blue-600","bg-violet-600","bg-rose-600","bg-amber-600","bg-teal-600"];



export const DATA_BY_AREA = {
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

export const TEAMS_INIT = [
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
export const RANKS_INIT = [
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
