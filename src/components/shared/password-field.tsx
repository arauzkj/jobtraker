"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function PasswordField({
  id = "password",
  label = "Contraseña",
  placeholder = "••••••••",
  autoComplete = "new-password",
  defaultValue,
  name,
  showPassword,
  setShowPassword,
}: PasswordFieldProps) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const isPasswordVisible = showPassword ?? internalShowPassword;
  const togglePasswordVisibility = () => {
    if (setShowPassword) {
      setShowPassword((value) => !value);
      return;
    }

    setInternalShowPassword((value) => !value);
  };

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <LockKeyhole />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          name={name ?? id}
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            type="button"
            aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}