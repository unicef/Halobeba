import { translateData, TranslateDataDoctorVisitPeriods, TranslateDataImmunizationsPeriods, TranslateDataImmunizationsPeriod } from "./translateData";

export function getImmunizationPeriodForDoctorVisitPeriod(doctorVisitPeriodId: string): TranslateDataImmunizationsPeriod | null {
    let rval: TranslateDataImmunizationsPeriod | null = null;

    const doctorVisitPeriods = translateData('doctorVisitPeriods') as (TranslateDataDoctorVisitPeriods);
    const immunizationsPeriods = translateData('immunizationsPeriods') as (TranslateDataImmunizationsPeriods);

    doctorVisitPeriods.forEach((doctorVisitPeriod) => {
        if (doctorVisitPeriod.uuid === doctorVisitPeriodId) {
            immunizationsPeriods.forEach((immunizationPeriod) => {
                if (immunizationPeriod.uuid === doctorVisitPeriod.immunizationsPeriodId) {
                    rval = immunizationPeriod;
                }
            });
        }
    });

    return rval;
}