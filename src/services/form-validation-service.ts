import { FieldMetadata, FieldValue, ValidationResult } from '../interfaces/interfaces';

export async function validateForm(
  fieldMetadata: Array<FieldMetadata>,
  fieldValues: Array<FieldValue>): Promise<ValidationResult> {

  return new Promise<ValidationResult>(resolve => {

    let res: ValidationResult = {
      result: true,
      displayMessage: ""
    }

    var requiredFields = fieldMetadata.filter((item) => {
      return item.isRequired;
    });

    for (let requiredField of requiredFields) {

      var fieldValue = fieldValues.find((item) => {
        return item.fieldId === requiredField.id;
      })

      if (!fieldValue || !fieldValue.value || fieldValue.value == '') {

        res.result = false;
        res.displayMessage = "Required field/s not supplied: " + requiredField.name;
      }
    }

    resolve(res);
  })
}