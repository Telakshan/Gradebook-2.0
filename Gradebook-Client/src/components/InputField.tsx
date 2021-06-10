import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import {  useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder: string;
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  // let InputOrTextarea = textarea ? Textarea : Input;
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textarea ? (
        <Textarea {...field} {...props} id={field.name} />
      ) : (
        <Input {...field} {...props} id={field.name} />
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
