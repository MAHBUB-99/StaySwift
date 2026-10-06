import LoginForm from "@/components/auth/LoginForm";
import SocialLogins from "@/components/auth/SocialLogins";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      <div className="card w-full max-w-[440px] p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <LoginForm />
        <SocialLogins mode="login" />
      </div>
    </section>
  );
}
