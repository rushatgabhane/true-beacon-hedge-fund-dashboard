'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { login } from '@/lib/actions/auth';
import Link from 'next/link';

const formSchema = z.object({
  username: z.string().trim().min(2, {
    message: 'Username must be at least 2 characters.',
  }),

  password: z.string().trim().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

function Login() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  function onSubmit(data: FormValues) {
    setErrorMessage('');
    login(data.username, data.password).then((response) => {
      if (response?.status === 401) {
        setErrorMessage('Invalid username or password.');
        return;
      }

      if (response?.status === 200) {
        window.location.href = '/';
        return;
      }

      setErrorMessage('An error occurred. Please try again.');
    });
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-sm mt-32">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            New user? Register{' '}
            <Link href="/register" className="text-blue-700 underline">
              here.
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="puppy-saturation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
                <Button type="submit">Login</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
