"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import FormInput from "../../components/ui/form_input";
import { Button } from "@/app/components/ui/buttons";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import AnimatedBackground from "@/app/layouts/templates/background";
import { Inter, Roboto, Poppins } from "next/font/google";
import { AnimatedNotification } from '../../components/ui/notifications';


const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-poppins' });

export default function AuthenticationPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/pages/dashboard');
            }
        };
        checkUser();
    }, [supabase, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
        // setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setShowError(true);
            setErrorMessage(error.message);
            // setError(error.message);
        } else {
            router.push("/pages/dashboard");
        }
    };

    return (
        <>
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-screen w-full">
            <form onSubmit={handleLogin} className="shadow-lg p-6 w-100 h-auto bg-gray-950/20 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-md border border-gray-100">
                <Image
                    src="/randomlogo.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="mx-auto mb-4"
                />
                <h2 className={`text-3xl mb-4 text-center ${inter.className}`}>SIGN IN</h2>
                <p className={`mb-6 text-center ${roboto.className}`}>Welcome back! Please enter your details.</p>
                <div>
                    <FormInput
                        label="Email Address"
                        type="email"
                        id="email"
                        name="email"    
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        required
                        icon={<MailIcon size={20} />}
                        iconPosition="left"
                    />
                </div>
                <div className="relative">
                    <FormInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        icon={<LockIcon size={20} />}
                        iconPosition="left"
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
                {/* forgot password */}
                <div className="text-sm text-right mb-4">
                    <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                </div>
                {/* login button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
                {/* sign up link */}
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
                </p>
            </form>
        </div>

        <AnimatedNotification
            type="success"
            message="User account created successfully!"
            isVisible={showSuccess}
            onClose={() => setShowSuccess(false)}
            duration={5000}
        />
        <AnimatedNotification
            type="error"
            message={errorMessage}
            isVisible={showError}
            onClose={() => setShowError(false)}
            duration={5000}
        />
        </>
    );
}