"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


type BaseProps = {
  name: string;
  label: string;
  description?: string;
  errors?: string[];
  defaultValue?: string;
  required?: boolean;
};

const toErrors = (messages?: string[]) => messages?.map((message) => ({ message }));

export function TextField({
  name,
  label,
  description,
  errors,
  multiline,
  ...inputProps
}: BaseProps & { multiline?: boolean } & Omit<React.ComponentProps<"input">, "name">) {
  const invalid = !!errors?.length;
  const shared = { id: name, name, "aria-invalid": invalid, defaultValue: inputProps.defaultValue };

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {multiline ? (
        <Textarea {...shared} rows={4} placeholder={inputProps.placeholder} required={inputProps.required} />
      ) : (
        <Input {...inputProps} {...shared} />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={toErrors(errors)} />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  description,
  errors,
  defaultValue,
  placeholder = "Select…",
  options,
  required,
}: BaseProps & { placeholder?: string; options: readonly { value: string; label: string }[] }) {
  const invalid = !!errors?.length;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select name={name} items={options} defaultValue={defaultValue || null} required={required}>
        <SelectTrigger id={name} aria-invalid={invalid} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={toErrors(errors)} />
    </Field>
  );
}

export function CheckboxField({ name, label, description, errors, defaultValue }: BaseProps) {
  const invalid = !!errors?.length;
  return (
    <Field orientation="horizontal" data-invalid={invalid}>
      <Checkbox id={name} name={name} defaultChecked={defaultValue === "on"} aria-invalid={invalid} />
      <FieldContent>
        <FieldLabel htmlFor={name} className="font-normal">
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={toErrors(errors)} />
      </FieldContent>
    </Field>
  );
}
