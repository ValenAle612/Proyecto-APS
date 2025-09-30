import { useForm } from "react-hook-form";
import axios from "axios";
export default function Login() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async data => {
    // llamar a /api/auth o a NextAuth
    try {
      await axios.post('/api/auth/login', data);
      // redirigir a dashboard
      window.location.href = '/dashboard';
    } catch(e) { alert('Error: '+e?.response?.data?.message || e.message) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow">
        <h2 className="text-xl mb-4">Iniciar sesión</h2>
        <input {...register('username',{required:true})} placeholder="Usuario" className="block mb-2 p-2 border" />
        <input {...register('password',{required:true})} type="password" placeholder="Contraseña" className="block mb-4 p-2 border" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
