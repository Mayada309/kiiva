'use client';
import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { isAxiosError } from 'axios';
// import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

import Image from 'next/image';
import logo from '@/images/kiiva.png';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { setCookie } from 'cookies-next';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { customFetch } from '@/utils/axios';

const loginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Password is required',
  }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      await customFetch.post('/login', data).then((res) => {
        setCookie('token', res?.data.token);
        toast.success('You have successfully logged in!');
        router.push('/admin');
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  // const adminLogin = async (formData: FormData) => {
  //   const rawData = Object.fromEntries(formData.entries());
  //   try {
  //     const response = await axios.post(
  //       'http://kiiva.localhost:8000/api/login',
  //       rawData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       router.push('/admin');
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.status === 401) {
  //         toast.error('Wrong password!');
  //       }
  //       console.log(error.response?.data);
  //     } else {
  //       console.log('Unexpected error:', error);
  //     }
  //   }
  // };

  return (
    <div className='flex flex-col items-center justify-center pt-36'>
      <div className='w-24 px-2'>
        <Image src={logo} priority alt='kiiva' />
      </div>
      <Card className='sm:w-[450px] w-[300px]'>
        <CardHeader>
          <CardTitle className='text-center text-2xl capitalize text-slate-700 font-bold'>
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid items-center gap-4'
            >
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className='flex flex-col space-y-1.5'>
                      <Input
                        placeholder='Email'
                        type='email'
                        className='rounded text-slate-600'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className='flex flex-col space-y-1.5'>
                      <Input
                        placeholder='Password'
                        type='password'
                        className='rounded text-slate-600'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <button
                type='submit'
                className='mt-4 bg-slate-700 text-white rounded py-2 hover:bg-orange-400 transition-colors duration-3000'
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
