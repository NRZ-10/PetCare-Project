import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const RegisterOwnerPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setIsLoading(true);
        try {
        const user = await register({ name: formData.name, email: formData.email, password: formData.password, role: 'owner' });
            const redirectMap = { owner: '/owner', caregiver: '/caregiver', admin: '/admin' };
            navigate(redirectMap[user.role] || '/');
        } catch (error) {
            // Handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign up as a Pet Owner
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input label="Full Name" id="name" type="text" required value={formData.name} onChange={handleChange} />
                        <Input label="Email address" id="email" type="email" required value={formData.email} onChange={handleChange} />
                        <Input label="Password" id="password" type="password" required value={formData.password} onChange={handleChange} />
                        <Input label="Confirm Password" id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default RegisterOwnerPage;
