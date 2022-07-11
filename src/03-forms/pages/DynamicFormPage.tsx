import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MySelect, MyTextInput } from "../components";
import formJson from "../data/custom-form.json";

// console.log(formJson);

const initialValues: { [key: string]: any } = {};
const requiredFields: { [key: string]: any } = {};

// Create input
for (const input of formJson) {
  initialValues[input.name] = input.value;

  // Validations form
  if (!input.validations) continue;

  let schema = Yup.string();

  for (const rule of input.validations) {
    if (rule.type === "required") {
      schema = schema.required("Este campo es requerido");
    }

    if (rule.type === "minLength") {
      schema = schema.min(
        (rule as any).value || 1,
        `Minimo de ${(rule as any).value || 2} caracteres`
      );
    }

    if (rule.type === "email") {
      schema = schema.email("ingresa un correo valido");
    }
  }

  requiredFields[input.name] = schema;
}

const validationSchema = Yup.object({ ...requiredFields });

export const DynamicFormPage = () => {
  return (
    <div>
      <h1>Dynamic Form Page</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            {formJson.map(({ type, name, placeholder, label, options }) => {
              if (type === "input" || type === "password" || type === "email") {
                return (
                  <MyTextInput
                    key={name}
                    type={type as any}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                  />
                );
              } else if (type === "select") {
                return (
                  <MySelect key={name} label={label} name={name}>
                    <option value="">Select an option</option>
                    {options?.map(({ id, label }) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </MySelect>
                );
              }
              throw new Error(`The type: ${type} is not soported`);
            })}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
