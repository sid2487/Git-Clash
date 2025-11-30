import Card from "@/components/Card";
import Hero from "@/components/Hero";
import RankPage from "@/components/LiveRank";
import UsernameInput from "@/components/UsernameInput";


export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="">
        <Card />
      </div>
      <div className="pt-10">
        <UsernameInput />
      </div>
      <RankPage />
    </div>
  );
}
