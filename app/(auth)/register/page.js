import RegistrationForm from "@/components/auth/RegistrationForm";
import SocialLogins from "@/components/auth/SocialLogins";

export const metadata = { title: "Create an account" };

export default function RegistrationPage() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      <div className="card w-full max-w-[440px] p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <RegistrationForm />
        <SocialLogins mode="register" />
      </div>
    </section>
  );
}
