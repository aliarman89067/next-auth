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
import { ResetSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../formerror";
import { FormSuccess } from "../formsuccess";
import { Reset } from "@/actions/reset";
import Link from "next/link";

export function ResetForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, startTransition] = useTransition();
  type TResetSchema = z.infer<typeof ResetSchema>;
  const form = useForm<TResetSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ResetSchema),
  });
  const onSubmit = (values: TResetSchema) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      Reset(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
        .catch(() => {
          setError("Something goes wrong!");
        });
    });
    // startTransition(() => {
    //   login(values).then((data) => {
    //     setError(data?.error);
    //     // TODO: SUCCESS ADDED WHEN MAKE 2FA VERIFICATION
    //     setSuccess(data?.success);
    //   });
    // });
  };
  return (
    <CardWrapper
      headerLabel="Forget your password?"
      backButtonLabel="back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
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
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
