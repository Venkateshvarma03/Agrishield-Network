import Card from "./Card";
import { Sprout, ShoppingCart, TrendingUp, Warehouse, Bell } from "lucide-react";
const stats=[
  {id:1,icon:Sprout,label:"My Crops",value:"3",subtext:"Active Crops",iconBg: "bg-green-100", iconColor: "text-green-600"},
  {id:2,icon:ShoppingCart,label:"Total Quantity",value:"45.6",subtext:"Quintals",iconBg: "bg-green-100", iconColor: "text-green-600"},
  {id:3,icon:TrendingUp,label:"Est.Revenue",value:"1,28,760",subtext:"Potential Earnings",iconBg: "bg-green-100", iconColor: "text-green-600"},
  {id:4,icon:Warehouse,label:"Storage Booked",value:"20",subtext:"Quintals",iconBg: "bg-green-100", iconColor: "text-green-600"},
  {id:5,icon:Bell,label:"Active Alerts",value:"2",subtext:"New Alerts",iconBg: "bg-green-100", iconColor: "text-green-600"},
]


function StatsCards() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((item) => (
        <Card
      key={item.id}
      icon={item.icon}
      label={item.label}
      value={item.value}
      subtext={item.subtext}
      iconBg={item.iconBg}
      iconColor={item.iconColor}
/>
      ))}
    </div>
  );
}

export default StatsCards;