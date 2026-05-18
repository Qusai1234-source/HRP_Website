import CompanyJourney from "@/app/components/about/CompanyJourney";

export const metadata = {
    title: "About Us | HRP Industrial Products",
    description: "Our journey from 1983 to present — industrial solutions built through experience.",
};

export default function AboutPage() {
    return (
        <main>
            <CompanyJourney />
            {/* Other about sections go here — Chat 4 */}
        </main>
    );
}