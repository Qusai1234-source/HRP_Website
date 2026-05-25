// app/about/page.jsx — Server Component (metadata + shell)
import CompanyJourney from "@/app/components/about/CompanyJourney";
import AboutSections from "@/app/components/about/AboutSections";

export const metadata = {
    title: "About Us | HRP Industrial Products",
    description:
        "Learn about HRP's 40+ year journey supplying industrial components across India.",
};

export default function AboutPage() {
    return (
        <>
            <CompanyJourney />
            <AboutSections />
        </>
    );
}
