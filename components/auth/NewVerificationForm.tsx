"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../formerror";
import { FormSuccess } from "../formsuccess";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  useEffect(() => {
    const onSubmit = async () => {
      if (!token) {
        setError("Token is missing!");
        return;
      }
      newVerification(token)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
        .catch(() => {
          setError("Something goes wrong!");
        });
    };
    return (): any => onSubmit();
  }, []);
  return (
    <CardWrapper
      headerLabel="Comfirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error ? (
          <BeatLoader />
        ) : (
          <>
            <FormError message={error} />
            <FormSuccess message={success} />
          </>
        )}
      </div>
    </CardWrapper>
  );
};
