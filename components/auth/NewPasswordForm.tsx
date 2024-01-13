"use client";
import React, { useState, useTransition } from "react";
import * as z from "zod";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../formerror";
import { FormSuccess } from "../formsuccess";
import { Reset } from "@/actions/reset";
import { useSearchParams } from "next/navigation";
import { NewPassword } from "@/actions/new-password";

export function NewPasswordForm() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, startTransition] = useTransition();
  type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
  const form = useForm<TNewPasswordSchema>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(NewPasswordSchema),
  });
  const onSubmit = (values: TNewPasswordSchema) => {
    console.log(token);

    if (!token) {
      return setError("Token is missing!");
    }
    setError("");
    setSuccess("");
    startTransition(() => {
      NewPassword(values, token)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
        .catch((error) => {
          setError("Something goes wrong!");
          console.log(error);
        });
    });
  };
  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your new password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={isLoading} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
