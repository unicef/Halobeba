import { translate } from '../../translations/translate';
import { translateData, TranslateDataDoctorVisitPeriods, TranslateDataImmunizationsPeriods, TranslateDataDoctorVisitPeriod } from '../../translationsData/translateData';
import { Props as DoctorVisitCardProps, DoctorVisitCardItemIcon, DoctorVisitCardButtonType, DoctorVisitTitleIconType, DoctorVisitCardItem, DoctorVisitCardButton } from '../../components/doctor-visit/DoctorVisitCard';
import { dataRealmStore } from '..';
import { userRealmStore } from '../userRealmStore';
import { Measures, ChildEntity } from '../ChildEntity';
import { DateTime } from 'luxon';
import { navigation } from '../../app';
import { NewDoctorVisitScreenType } from '../../screens/vaccination/NewDoctorVisitScreen';

export function getDoctorVisitCardsBirthdayIsNotSet(): DoctorVisitCardProps[] {
    let rval: DoctorVisitCardProps[] = [];

    // REQUIRED DATA
    const doctorVisitPeriods = translateData('doctorVisitPeriods') as (TranslateDataDoctorVisitPeriods);
    if (!doctorVisitPeriods) return [];

    // BIRTHDAY IS NOT ENTERED
    doctorVisitPeriods.forEach((doctorVisit, index) => {
        rval.push({
            title: doctorVisit.nameOfTheDoctorVisit,
            subTitle: doctorVisit.periodSubtitle,
            items: [
                {
                    icon: DoctorVisitCardItemIcon.Syringe,
                    text: translate('doctorVisitsVaccineDataNotEntered'),
                },
                {
                    icon: DoctorVisitCardItemIcon.Weight,
                    text: translate('doctorVisitsMeasuresNotEntered'),
                },
            ],
            buttons: [
                {
                    type: DoctorVisitCardButtonType.Text,
                    text: translate('doctorVisitsReadMore'),
                    onPress: () => {
                        if (doctorVisit.moreAboutDoctorVisitArticleId && doctorVisit.moreAboutDoctorVisitArticleId !== 0) {
                            dataRealmStore.openArticleScreen(doctorVisit.moreAboutDoctorVisitArticleId);
                        }
                    },
                }
            ],
            showVerticalLine: index !== doctorVisitPeriods.length - 1,
        });
    });

    return rval;
}

export function getDoctorVisitCardsBirthdayIsSet(currentChild: ChildEntity & Realm.Object): DoctorVisitCardProps[] {
    let rval: DoctorVisitCardProps[] = [];

    // SET currentChildAgeInDays
    const currentChildAgeInDays = userRealmStore.getCurrentChildAgeInDays();

    // SET doctorVisitPeriods
    const doctorVisitPeriods = translateData('doctorVisitPeriods') as (TranslateDataDoctorVisitPeriods);
    if (!doctorVisitPeriods) return [];

    // SET regularAndAdditionalMeasures
    const regularAndAdditionalMeasures = userRealmStore.getRegularAndAdditionalMeasures();

    // SET shouldAddRemindersForDoctorVisits
    const shouldAddRemindersForDoctorVisits = userRealmStore.shouldAddRemindersForDoctorVisits(currentChildAgeInDays);

    // ADD REGULAR CARDS
    const regularCards: DoctorVisitCardProps[] = [];

    doctorVisitPeriods.forEach((doctorVisitPeriod) => {
        // SET thisPeriodMeasures
        let thisPeriodMeasures: Measures | null = null;

        regularAndAdditionalMeasures.regularMeasures.forEach((value) => {
            if (value.doctorVisitPeriodUuid === doctorVisitPeriod.uuid) {
                thisPeriodMeasures = value.measures;
            }
        });

        // SET measuresEnteredType
        let measuresEnteredType: MeasuresEnteredType = MeasuresEnteredType.NotEntered;

        if (thisPeriodMeasures !== null) {
            const m = thisPeriodMeasures as Measures;

            if (
                m.isChildMeasured && m.length && m.length !== '' && m.weight && m.weight !== ''
                && m.didChildGetVaccines && m.vaccineIds && Array.isArray(m.vaccineIds) && m.vaccineIds.length > 0
            ) {
                measuresEnteredType = MeasuresEnteredType.EnteredFully;
            } else {
                measuresEnteredType = MeasuresEnteredType.EnteredIncomplete;
            }
        }

        // CREATE CARD PROPS
        // Title
        let cardTitle = '';
        let cardSubTitle = '';
        let cardTitleIcon: DoctorVisitTitleIconType | undefined = undefined;

        if (thisPeriodMeasures !== null) {
            // cardTitle
            cardTitle = doctorVisitPeriod.periodSubtitle;

            // cardSubTitle
            let cardMeasurementMillis = (thisPeriodMeasures as Measures).measurementDate;
            if (cardMeasurementMillis) {
                let cardMeasurementDateTime = DateTime.fromMillis(cardMeasurementMillis);
                cardSubTitle = cardMeasurementDateTime.toFormat("dd.MM.yyyy");
            }

            // cardTitleIcon
            if (measuresEnteredType === MeasuresEnteredType.EnteredFully) {
                cardTitleIcon = DoctorVisitTitleIconType.Checked;
            }
            if (measuresEnteredType === MeasuresEnteredType.EnteredIncomplete) {
                cardTitleIcon = DoctorVisitTitleIconType.Info;
            }
        } else {
            cardTitle = doctorVisitPeriod.nameOfTheDoctorVisit;
            cardSubTitle = doctorVisitPeriod.periodSubtitle;
        }

        // Items
        const items = getCardItems(thisPeriodMeasures);

        // Buttons
        const buttons: DoctorVisitCardButton[] = [
            {
                type: DoctorVisitCardButtonType.Text,
                text: translate('doctorVisitsReadMore'),
                onPress: () => { dataRealmStore.openArticleScreen(doctorVisitPeriod.moreAboutDoctorVisitArticleId) },
            }
        ]

        // Buttons: shoulShowButtonEnterDoctorVisitReminder
        let shoulShowButtonEnterDoctorVisitReminder = false;

        shouldAddRemindersForDoctorVisits.forEach((reminder) => {
            if (
                reminder.periodId === doctorVisitPeriod.uuid
                && reminder.shouldAddReminder
            ) {
                shoulShowButtonEnterDoctorVisitReminder = true;
            }
        });

        if (shoulShowButtonEnterDoctorVisitReminder) {
            buttons.push({
                type: DoctorVisitCardButtonType.HollowPurple,
                text: translate('doctorVisitsAddReminderButton'),
                onPress: () => { navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen', { screenType: NewDoctorVisitScreenType.HeltCheckUp }) },
            });
        }

        // Buttons: shoulShowButtonEnterDoctorVisit
        const shoulShowButtonEnterDoctorVisit = showButtonEnterDoctorVisit(
            doctorVisitPeriod,
            thisPeriodMeasures,
        );

        if (shoulShowButtonEnterDoctorVisit) {
            buttons.push({
                type: DoctorVisitCardButtonType.Purple,
                text: translate('doctorVisitsAddMeasuresButton'),
                onPress: () => { navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen', { screenType: NewDoctorVisitScreenType.HeltCheckUp }) },
            });

            if (measuresEnteredType === MeasuresEnteredType.NotEntered) {
                cardTitleIcon = DoctorVisitTitleIconType.Add;
            }
        }

        // Ordering
        let ordering: number = 0;

        if (thisPeriodMeasures !== null) {
            const m = thisPeriodMeasures as Measures;
            ordering = m.measurementDate as number;
        } else {
            const periodFromDays = doctorVisitPeriod.childAgeInDays.from;
            const childBirtday = DateTime.fromJSDate(currentChild.birthDate as Date);
            ordering = childBirtday.plus({ days: periodFromDays }).toMillis();
        }

        // CREATE REGULAR CARD
        regularCards.push({
            ordering, // milliseconds
            title: cardTitle,
            subTitle: cardSubTitle,
            items: items,
            titleIcon: cardTitleIcon,
            buttons: buttons,
        });
    });

    // ADD ADDITIONAL CARDS
    const additionalCards: DoctorVisitCardProps[] = [];

    regularAndAdditionalMeasures.additionalMeasures.filter(item => item.measurementPlace === "doctor").forEach((measures) => {
        // SET measuresEnteredType
        let measuresEnteredType: MeasuresEnteredType = MeasuresEnteredType.NotEntered;

        if (measures !== null) {
            const m = measures as Measures;

            if (
                m.isChildMeasured && m.length && m.length !== '' && m.weight && m.weight !== ''
                && m.didChildGetVaccines && m.vaccineIds && Array.isArray(m.vaccineIds) && m.vaccineIds.length > 0
            ) {
                measuresEnteredType = MeasuresEnteredType.EnteredFully;
            } else {
                measuresEnteredType = MeasuresEnteredType.EnteredIncomplete;
            }
        }

        // CREATE CARD PROPS
        // Title
        let cardTitle = '';
        let cardSubTitle = '';
        let cardTitleIcon: DoctorVisitTitleIconType | undefined = undefined;

        // cardTitle
        cardTitle = translate('doctorVisitsAddtionalCheckUpTitle');

        // cardSubTitle
        let cardMeasurementMillis = measures.measurementDate;
        if (cardMeasurementMillis) {
            let cardMeasurementDateTime = DateTime.fromMillis(cardMeasurementMillis);
            cardSubTitle = cardMeasurementDateTime.toFormat("dd.MM.yyyy");
        }

        // cardTitleIcon
        if (measuresEnteredType === MeasuresEnteredType.EnteredFully) {
            cardTitleIcon = DoctorVisitTitleIconType.Checked;
        }
        if (measuresEnteredType === MeasuresEnteredType.EnteredIncomplete) {
            cardTitleIcon = DoctorVisitTitleIconType.Info;
        }

        // Items
        const items = getCardItems(measures);

        // Ordering
        let ordering: number = measures.measurementDate as number;

        // CREATE REGULAR CARD
        additionalCards.push({
            ordering, // milliseconds
            title: cardTitle,
            subTitle: cardSubTitle,
            items: items,
            titleIcon: cardTitleIcon,
            buttons: [],
        });
    });

    // ADD CARD FOR ENTERING ADDITIONAL CHECK-UPS
    additionalCards.push({
        ordering: Date.now(), // milliseconds
        title: translate('doctorVisitsAddtionalCheckUpTitle'),
        items: [],
        titleIcon: DoctorVisitTitleIconType.Add,
        buttons: [
            {
                type: DoctorVisitCardButtonType.HollowPurple,
                text: translate('doctorVisitsAddReminderButton'),
                onPress: () => { navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen', { screenType: NewDoctorVisitScreenType.HeltCheckUp }) },
            },
            {
                type: DoctorVisitCardButtonType.Purple,
                text: translate('doctorVisitsAddMeasuresButton'),
                onPress: () => { navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen', { screenType: NewDoctorVisitScreenType.HeltCheckUp }) },
            }
        ],
    });

    // COMBINE CARDS
    rval = regularCards.concat(additionalCards);


    // SORT CARDS
    rval.sort((cardA, cardB) => {
        if ((cardA.ordering as number) > (cardB.ordering as number)) return 1;
        if ((cardA.ordering as number) < (cardB.ordering as number)) return -1;
        return 0;
    });

    // SET showVerticalLine FOR THE LAST CARD
    rval[rval.length - 1].showVerticalLine = false;

    return rval;
}

function getVaccineNames(vaccineIds: string[]): string[] {
    const vaccineNames: string[] = [];

    const immunizationsPeriods = translateData('immunizationsPeriods') as (TranslateDataImmunizationsPeriods);

    vaccineIds.forEach((vaccineId) => {
        let vaccineName: string = 'no vaccine name';

        immunizationsPeriods.forEach((value) => {
            const currentVaccines = value.vaccines;
            currentVaccines.forEach((vaccine) => {
                if (vaccine.uuid === vaccineId) {
                    vaccineName = vaccine.title;
                }
            });
        });

        vaccineNames.push(vaccineName);
    });

    return vaccineNames;
}

function getCardItems(periodMeasures: Measures | null): DoctorVisitCardItem[] {
    const items: DoctorVisitCardItem[] = [];

    // Items: Vaccines
    let vaccinesText: string = '';

    if (periodMeasures) {
        const m = periodMeasures as Measures;

        if (m.didChildGetVaccines === false) {
            vaccinesText = translate('doctorVisitsVaccinesNotGiven');
        } else if (m.didChildGetVaccines === true) {
            vaccinesText = translate('doctorVisitsVaccinesGiven');

            if (m.vaccineIds && Array.isArray(m.vaccineIds) && m.vaccineIds.length > 0) {
                // vaccinesText += `\n`;

                const vaccineNames = getVaccineNames(m.vaccineIds);
                vaccineNames.forEach((vaccineName) => {
                    vaccinesText += `\n• ${vaccineName}`;
                });
            }
        } else {
            vaccinesText = translate('doctorVisitsVaccineDataNotEntered');
        }
    } else {
        vaccinesText = translate('doctorVisitsVaccineDataNotEntered');
    }

    items.push({
        text: vaccinesText,
        icon: DoctorVisitCardItemIcon.Syringe,
    });

    // Items: Measures
    let measuresText: string = '';

    if (periodMeasures) {
        const m = periodMeasures as Measures;

        if (m.isChildMeasured === false) {
            measuresText = translate('doctorVisitsMeasuresNotEntered');
        } else if (m.isChildMeasured === true) {
            if ((m.length && m.length !== '') || (m.weight && m.weight !== '')) {
                measuresText = translate('doctorVisitsMeasuresEnteredAndGiven');
                measuresText = measuresText.replace('%LENGTH%', m.length);

                const childWeightString: string | undefined = m.weight;
                let childWeight = (parseFloat(childWeightString) / 1000).toPrecision(2);
                measuresText = measuresText.replace('%WEIGHT%', childWeight);
            } else {
                measuresText = translate('doctorVisitsMeasuresEnteredButNotGiven');
            }
        } else {
            measuresText = translate('doctorVisitsMeasuresNotEntered');
        }
    } else {
        measuresText = translate('doctorVisitsMeasuresNotEntered');
    }

    items.push({
        text: measuresText,
        icon: DoctorVisitCardItemIcon.Weight,
    });

    // Items: Doctor comment
    if (periodMeasures) {
        const m = periodMeasures as Measures;

        if (m.doctorComment) {
            items.push({
                text: m.doctorComment,
                icon: DoctorVisitCardItemIcon.Stethoscope,
            });
        }
    }

    return items;
}

/**
 * Returns true if button "Enter doctor visit data", should be shown.
 */
function showButtonEnterDoctorVisit(
    doctorVisitPeriod: TranslateDataDoctorVisitPeriod,
    thisPeriodMeasures: Measures | null
): boolean {
    let rval = false;
    const childAgeInDays = userRealmStore.getCurrentChildAgeInDays();

    // SET isPeriodPassed
    let isPeriodPassed = false;

    if (childAgeInDays > doctorVisitPeriod.childAgeInDays.to) {
        isPeriodPassed = true;
    }

    // SET isPeriodCurrent
    let isPeriodCurrent = false;

    if (
        (childAgeInDays >= doctorVisitPeriod.childAgeInDays.from)
        &&
        (childAgeInDays <= doctorVisitPeriod.childAgeInDays.to)
    ) {
        isPeriodCurrent = true;
    }

    // SET arePeriodMeasuresEntered
    let arePeriodMeasuresEntered = thisPeriodMeasures === null ? false : true;

    // SET rval
    rval = (isPeriodPassed || isPeriodCurrent) && !arePeriodMeasuresEntered;

    return rval;
}

enum MeasuresEnteredType {
    EnteredFully,
    EnteredIncomplete,
    NotEntered,
};