import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export enum Language {
  Arabic = 1,
  English = 2
}

export function TextLangValidator(lang: Language): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // إذا كان الحقل فارغاً اترك التحقق لـ Validators.required
    }

    let pattern: RegExp;

    if (lang === Language.Arabic) {
      // الحروف العربية والمساحات فقط
      pattern = /^[\u0600-\u06FF\s]+$/;
    } else {
      // الحروف الإنجليزية والمساحات فقط
      pattern = /^[a-zA-Z\s]+$/;
    }

    // هنا نختبر هل المدخل يطابق الباترن المطلوب أم لا
    const isValid = pattern.test(control.value);
    
    // إذا لم يكن مطابقاً، نُرجع خطأ (invalidLanguage أو غيره حسب اختيارك)
    return !isValid ? { invalidLanguage: { value: control.value } } : null;
  };
}