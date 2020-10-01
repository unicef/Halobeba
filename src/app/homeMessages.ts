import { Message, IconType } from "../components/HomeMessages";
import { dataRealmStore, userRealmStore, ChildEntity } from "../stores";
import { DailyMessageEntity, DailyMessageEntitySchema } from "../stores/DailyMessageEntity";
import { appConfig } from "./appConfig";
import { DateTime } from 'luxon';
import { translate } from "../translations/translate";
import { RoundedButtonType } from "../components/RoundedButton";
import { navigation } from ".";
import { translateData, TranslateDataGrowthPeriodsMessages, TranslateDataGrowthMessagesPeriod, TranslateDataDevelopmentPeriods, TranslateDataImmunizationsPeriod, TranslateDataImmunizationsPeriods } from "../translationsData/translateData";
import { utils } from "./utils";
import { Measures } from "../stores/ChildEntity";
import { getImmunizationPeriodForDoctorVisitPeriod } from "../translationsData/translationsDataUtils";
import { DoctorVisitCardButtonType } from "../components/doctor-visit/DoctorVisitCard";
import { NewDoctorVisitScreenType } from "../screens/vaccination/NewDoctorVisitScreen";
import { TextButtonColor } from "../components/TextButton";
import { Vaccine } from "../components/vaccinations/oneVaccinations";
import { replace } from "lodash";

/**
 * Home messages logic is here.
 * 
 * ### USAGE
 * 
 * ```
 * const messages = homeMessages.getMessages();
 * ```
 */
class HomeMessages {
    private currentChild?: ChildEntity;
    private childAgeInDays?: number;
    private static instance: HomeMessages;

    private constructor() { }

    static getInstance(): HomeMessages {
        if (!HomeMessages.instance) {
            HomeMessages.instance = new HomeMessages();
        }
        return HomeMessages.instance;
    }

    public getMessages(): Message[] {
        let rval: Message[] = [];

        // console.log('this.childAgeInDays', this.childAgeInDays);

        // Set properties
        this.currentChild = userRealmStore.getCurrentChild();
        this.childAgeInDays = userRealmStore.getCurrentChildAgeInDays();

        const settingsNotificationsApp = dataRealmStore.getVariable('notificationsApp');
        const settingsFollowGrowth = dataRealmStore.getVariable('followGrowth');
        const settingsFollowDevelopment = dataRealmStore.getVariable('followDevelopment');
        const settingsFollowDoctorVisits = dataRealmStore.getVariable('followDoctorVisits');

        // Upcomming development period message
        if (settingsNotificationsApp && settingsFollowDevelopment) {
            const upcommingDevelopmentPeriodMessage = this.getUpcommingDevelopmentPeriodMessage();
            if (upcommingDevelopmentPeriodMessage) rval.push(upcommingDevelopmentPeriodMessage);
        }

        // Ongoing development period message
        if (settingsNotificationsApp && settingsFollowDevelopment) {
            const ongoingDevelopmentPeriodMessage = this.getOngoingDevelopmentPeriodMessage();
            if (ongoingDevelopmentPeriodMessage) rval.push(ongoingDevelopmentPeriodMessage);
        }

        // Enter birthday messages
        const enterBirthdayMessages = this.getEnterBirthdayMessages();
        if (enterBirthdayMessages.length > 0) rval = rval.concat(enterBirthdayMessages);

        // Daily message
        const dailyMessage = this.getDailyMessage();
        if (dailyMessage) rval.push(dailyMessage);

        // Growth messages
        if (settingsNotificationsApp && settingsFollowGrowth) {
            const growthMessages = this.getGrowthMessages();
            if (growthMessages.length > 0) rval = rval.concat(growthMessages);
        }

        // Encourage child development message
        if (settingsNotificationsApp && settingsFollowDevelopment) {
            const encourageChildDevelopmentMessage = this.getEncourageChildDevelopmentMessage();
            if (encourageChildDevelopmentMessage) rval.push(encourageChildDevelopmentMessage);
        }

        // Update milestones message
        if (settingsNotificationsApp && settingsFollowDevelopment) {
            const updateMilestonesMessage = this.getUpdateMilestonesMessage();
            if (updateMilestonesMessage) rval.push(updateMilestonesMessage);
        }

        // Doctor visits, add reminders messages
        if (settingsNotificationsApp && settingsFollowDoctorVisits) {
            const doctorVisitAddReminderMessages = this.getDoctorVisitAddReminderMessages();
            if (doctorVisitAddReminderMessages.length > 0) rval = rval.concat(doctorVisitAddReminderMessages);
        }

        // Doctor visits, show reminders messages
        if (settingsNotificationsApp && settingsFollowDoctorVisits) {
            const doctorVisitShowRemindersMessages = this.getDoctorVisitShowRemindersMessages();
            if (doctorVisitShowRemindersMessages.length > 0) rval = rval.concat(doctorVisitShowRemindersMessages);
        }

        // Doctor visits, show missed reminders messages
        if (settingsNotificationsApp && settingsFollowDoctorVisits) {
            const doctorVisitMissedRemindersMessages = this.getDoctorVisitMissedRemindersMessages();
            if (doctorVisitMissedRemindersMessages.length > 0) rval = rval.concat(doctorVisitMissedRemindersMessages);
        }

        if (settingsNotificationsApp && settingsFollowDoctorVisits) {
            const getVaccinationMessages = this.getVaccinationMessage();
            if (getVaccinationMessages) rval.push(getVaccinationMessages);
        }

        return rval;
    }

    private getVaccinationMessage(): Message | null {
        let rval: Message | null = null;
        let nonRecivedVaccinations: Vaccine[] = [];

        const immunizationsPeriods = translateData('immunizationsPeriods') as (TranslateDataImmunizationsPeriods | null);
        const childAgeInDays = userRealmStore.getCurrentChildAgeInDays();

        if (childAgeInDays) {
            let currentImmunizationPeriod = immunizationsPeriods?.find(period => period.notificationDayStart <= childAgeInDays && period.notificationDayEnd >= childAgeInDays);

            let recivedVaccinations = userRealmStore.getAllReceivedVaccines();
            let messageFinal = "";
            let childName = userRealmStore.getCurrentChild()?.name;
            let genderString = userRealmStore.getCurrentChild()?.gender === "boy" ? translate('receivedMale') : translate('receivedFemale');
            let hisHerString = userRealmStore.getCurrentChild()?.gender === "boy" ? translate('his') : translate('her');
            let recivedVacinationDate: number[] = [];

            if (currentImmunizationPeriod && currentImmunizationPeriod.vaccines && currentImmunizationPeriod.vaccines.length > 0) {
                if (recivedVaccinations) {

                    let recivedVaccinationIds: string[] = [];
                    recivedVaccinations.forEach(item => {
                        item.uuid.forEach(uid => {
                            recivedVaccinationIds.push(uid.toString());
                        });
                    });

                    currentImmunizationPeriod.vaccines?.map(vaccine => {
                        let complete = true;

                        if (recivedVaccinationIds.indexOf(vaccine.uuid) === -1) {
                            complete = false;
                        }else{
                            if(recivedVaccinations.find(item => item.uuid.find(uuid => vaccine.uuid))?.date){
                                let date = recivedVaccinations.find(item => item.uuid.find(uuid => vaccine.uuid))?.date;
                                if(date){
                                    recivedVacinationDate.push(date)
                                };
                            };
                        };

                        if (!complete) {
                            nonRecivedVaccinations.push({
                                complete: false,
                                hardcodedArticleId: vaccine.hardcodedArticleId,
                                title: vaccine.title,
                                uuid: vaccine.uuid,
                            })
                        }
                    });

                    if (nonRecivedVaccinations.length > 0) {
                        // SET messageVaccines
                        messageFinal =  translate('vaccinationMessages').replace('%NAME%', utils.upperCaseFirstLetter(childName ? childName : ""));
                        let messageVaccines: string | null = null;

                        messageVaccines = nonRecivedVaccinations.map((vaccine) => {
                            return '• ' + vaccine.title;
                        }).join("\n");

                        messageFinal += '\n' + messageVaccines;
                    } else {

                        // If last vaccination checked this month get message 10 days from days of last received vaccination 

                        let currentDate = DateTime.local();
                        let currentMonth = currentDate.month;
                        let currentDayInMonth = currentDate.day;

                        let lastReceivedVaccinationMonth = recivedVacinationDate.length > 0 ? recivedVacinationDate.sort((a,b) => a - b) : null;

                        if(lastReceivedVaccinationMonth){

                            let lastVaccinationDay = DateTime.fromMillis(lastReceivedVaccinationMonth[lastReceivedVaccinationMonth.length - 1]).day
                            let lastVaccinationMonth = DateTime.fromMillis(lastReceivedVaccinationMonth[lastReceivedVaccinationMonth.length - 1]).month;

                            if(currentMonth === lastVaccinationMonth){
                                if(
                                    currentDayInMonth - lastVaccinationDay >= 0 && 
                                    currentDayInMonth - lastVaccinationDay <= 10
                                ){
                                    messageFinal =  translate('vaccinationAllVaccinesReceivedMessage').replace('%NAME%', utils.upperCaseFirstLetter(childName ? childName : "")).replace('%RECEIVED%', genderString).replace('%HIS_HER%', hisHerString);
                                }
                            }else{
                                // If last vaccination not received this month get message 10 days from month start 
                                if(currentDayInMonth <= 10){
                                    messageFinal =  translate('vaccinationAllVaccinesReceivedMessage').replace('%NAME%', utils.upperCaseFirstLetter(childName ? childName : "")).replace('%RECEIVED%', genderString).replace('%HIS_HER%', hisHerString);
                                };
                            };
                        };
                    };
                } else {
                    nonRecivedVaccinations = currentImmunizationPeriod.vaccines.map(item => {
                        return {
                            complete: false,
                            hardcodedArticleId: item.hardcodedArticleId,
                            title: item.title,
                            uuid: item.uuid,
                        };
                    });
                };
            };

            let dayInMonth = DateTime.local().day;


            if (messageFinal !== "") {
                rval = {
                    text: messageFinal,
                    iconType: IconType.syringe
                };
            }


        };


        return rval;
    }

    public getHomePollMessages(): Message[]{
        let rval: Message[] = [];
        // Polls messages 
        const pollsMessages = this.getPollsMessages();
        rval = rval.concat(pollsMessages);

        return rval;
    }

    private getPollsMessages(): Message[] {
        let rval: Message[] = [];

        let activePolls = dataRealmStore.getActivePolls();

        if(activePolls.length === 0) return [];

        activePolls.forEach(poll => {
            rval.push({
                text: poll.title,
                iconType: IconType.message,
                button: {
                    text: translate('goToPollsBtn'),
                    type: RoundedButtonType.hollowWhite,
                    showArrow: true,
                    onPress: () => {
                        navigation.navigate('HomeStackNavigator_PollsScreen', {polls: poll, title: poll.title});
                    }
                }
            });
        });


        return rval;
    }

    private getDailyMessage(): Message | null {
        let rval: Message | null = null;

        const dailyMessageVariable = dataRealmStore.getVariable('dailyMessage');

        // DAILY MESSAGE VARIABLE WAS NEVER SET
        if (!dailyMessageVariable) {
            try {
                // Set firstDailyMessageEntity
                let firstDailyMessageEntity: DailyMessageEntity | null = null;
                let allRecords = dataRealmStore.realm?.objects<DailyMessageEntity>(DailyMessageEntitySchema.name)
                    .sorted('id');

                const justFirstInArray = allRecords?.slice(0, 1);
                if (justFirstInArray && justFirstInArray[0]) {
                    firstDailyMessageEntity = justFirstInArray[0];
                }

                // Set newDailyMessageVariable
                let newDailyMessageVariable: DailyMessageVariable | null = null;

                if (firstDailyMessageEntity) {
                    let currentDate = DateTime.local();

                    newDailyMessageVariable = {
                        messageId: firstDailyMessageEntity.id,
                        messageText: firstDailyMessageEntity.title,
                        day: currentDate.day,
                        month: currentDate.month,
                        year: currentDate.year,
                    };

                    dataRealmStore.setVariable('dailyMessage', newDailyMessageVariable);

                    rval = {
                        text: newDailyMessageVariable.messageText,
                    };
                }
            } catch (e) {
                if (appConfig.showLog) console.log(e);
            }
        }

        // CHECK IF DAILY MESSAGE VARIABLE NEEDS TO BE UPDATED
        let dailyMessageVariableNeedsUpdate = false;

        if (dailyMessageVariable) {
            const currentDate = DateTime.local();

            if (
                dailyMessageVariable.day != currentDate.day
                || dailyMessageVariable.month != currentDate.month
                || dailyMessageVariable.year != currentDate.year
            ) {
                dailyMessageVariableNeedsUpdate = true;
            }
        }

        // USE CURRENT DAILY MESSAGE VARIABLE
        if (dailyMessageVariable && !dailyMessageVariableNeedsUpdate) {
            rval = {
                text: dailyMessageVariable.messageText,
            };
        }

        // UPATE DAILY MESSAGE VARIABLE
        if (dailyMessageVariable && dailyMessageVariableNeedsUpdate) {
            // Load all daily messages from realm
            let allDailyMessageEntities: DailyMessageEntity[] | undefined = undefined;

            const allRecords = dataRealmStore.realm?.objects<DailyMessageEntity>(DailyMessageEntitySchema.name)
                .sorted('id');

            allDailyMessageEntities = allRecords?.map(value => value);

            if (allDailyMessageEntities) {
                // Find the index of current daily message
                let currentIndex: number | null = null;

                allDailyMessageEntities.forEach((value, index) => {
                    if (value.id == dailyMessageVariable.messageId) {
                        currentIndex = index;
                    }
                });

                if (currentIndex !== null) {
                    // Find next index
                    let nextIndex = currentIndex + 1;

                    if (nextIndex >= allDailyMessageEntities.length) {
                        nextIndex = 0;
                    }

                    // Set next daily message entity
                    let nextDailyMessageEntity = allDailyMessageEntities[nextIndex];

                    // Save next daily message entity into variable
                    const currentDate = DateTime.local();

                    dataRealmStore.setVariable('dailyMessage', {
                        messageId: nextDailyMessageEntity.id,
                        messageText: nextDailyMessageEntity.title,
                        day: currentDate.day,
                        month: currentDate.month,
                        year: currentDate.year,
                    });

                    // Set rval
                    rval = {
                        text: nextDailyMessageEntity.title,
                    };
                }
            }
        }

        if (rval) {
            rval.iconType = IconType.heart;
        }

        return rval;
    }

    private getEnterBirthdayMessages(): Message[] {
        let rval: Message[] = [];

        // Get currentChild
        if (!this.currentChild) return [];

        if (!this.currentChild.birthDate) {
            // Message: Child has its profile
            let messageText = translate('homeMessageChildHasItsProfile');

            let childName = '';
            if (this.currentChild.name) childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            messageText = messageText.replace('%CHILD%', childName);

            rval.push({
                text: messageText,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            });

            // Message: Enter baby data
            rval.push({
                text: translate('homeMessageEnterBabyData'),
                button: {
                    text: translate('homeMessageEnterBabyDataButton'),
                    type: RoundedButtonType.purple,
                    onPress: () => {
                        navigation.navigate('HomeStackNavigator_BirthDataScreen');
                    }
                }
            });
        }

        return rval;
    }

    private getUpcommingDevelopmentPeriodMessage(): Message | null {
        let rval: Message | null = null;

        if (!this.currentChild || !this.currentChild.birthDate) return null;

        // Set babyBirthday, currentDate
        const babyBirthDate = DateTime.fromJSDate(this.currentChild.birthDate);
        const currentDate = DateTime.local();

        // Set babyAgeInDays
        const diffDate = currentDate.diff(babyBirthDate, 'days');
        let babyAgeInDays = diffDate.get('days');

        if (babyAgeInDays < 0) return null;
        babyAgeInDays = Math.ceil(babyAgeInDays);

        // Get all development periods
        const developmentPeriods = translateData('developmentPeriods');

        // Find active period
        let activePeriodHomeMessage: string | null = null;

        developmentPeriods?.forEach((value: any, index: any) => {
            if (
                (value.daysStart - babyAgeInDays > 0)
                && (value.daysStart - babyAgeInDays <= 10)
            ) {
                if (value.homeMessageBefore) {
                    activePeriodHomeMessage = value.homeMessageBefore;
                }
            }
        });

        // Add message for active period
        if (activePeriodHomeMessage) {
            let homeMessage: string = activePeriodHomeMessage;
            let childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            homeMessage = homeMessage.replace('%CHILD%', childName);

            rval = {
                text: homeMessage,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            };
        }

        return rval;
    }

    private getOngoingDevelopmentPeriodMessage(): Message | null {
        let rval: Message | null = null;

        if (!this.currentChild || !this.currentChild.birthDate) return null;

        // Set babyBirthday, currentDate
        const babyBirthDate = DateTime.fromJSDate(this.currentChild.birthDate);
        const currentDate = DateTime.local();

        // Set babyAgeInDays
        const diffDate = currentDate.diff(babyBirthDate, 'days');
        let babyAgeInDays = diffDate.get('days');

        if (babyAgeInDays < 0) return null;
        babyAgeInDays = Math.ceil(babyAgeInDays);

        // Get all development periods
        const developmentPeriods = translateData('developmentPeriods');

        // Find active period
        let activePeriodHomeMessage: string | null = null;

        developmentPeriods?.forEach((value: any, index: any) => {
            if (
                (babyAgeInDays - value.daysStart >= 0)
                && (babyAgeInDays - value.daysStart <= 10)
            ) {
                if (value.homeMessageAfter) {
                    activePeriodHomeMessage = value.homeMessageAfter;
                }
            }
        });

        // Add message for active period
        if (activePeriodHomeMessage) {
            let homeMessage: string = activePeriodHomeMessage;
            let childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            homeMessage = homeMessage.replace('%CHILD%', childName);

            rval = {
                text: homeMessage,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            };
        }

        return rval;
    }

    private getGrowthMessages(): Message[] {
        let rval: Message[] = [];

        // Set currentHealthCheckPeriod
        const currentHealthCheckPeriod = this.currentHealthCheckPeriod();

        // Is child currently in helath check period?
        if (!currentHealthCheckPeriod) {
            return [];
        }

        // Set measuresForHealthCheckPeriod
        const measuresForHealthCheckPeriod = this.measuresForHealthCheckPeriod(currentHealthCheckPeriod);

        // Show "Measurement data is NOT entered"
        if (!measuresForHealthCheckPeriod) {
            rval.push({
                text: translate('homeMessageGrowthMeasurementNotEntered'),
                iconType: IconType.growth,
                button: {
                    text: translate('homeMessageGrowthAddMeasurementButton'),
                    type: RoundedButtonType.purple,
                    onPress: () => { navigation.navigate('HomeStackNavigator_NewMeasurementScreen'); }
                }
            });
        }

        // Show "Measurement data is entered"
        if (measuresForHealthCheckPeriod && this.currentChild?.gender && this.childAgeInDays && this.childAgeInDays != 0) {
            const interpretationLengthForAge = userRealmStore.getInterpretationLenghtForAge(this.currentChild?.gender, measuresForHealthCheckPeriod);
            const interpretationWeightForHeight = userRealmStore.getInterpretationWeightForHeight(this.currentChild?.gender, this.childAgeInDays, measuresForHealthCheckPeriod);

            const measureIsGood = interpretationLengthForAge.goodMeasure && interpretationWeightForHeight.goodMeasure;

            let intepretationText: string = '';
            if (measureIsGood) {
                intepretationText = translate('homeMessageGrowthMeasurementsOk').replace('%CHILD%', utils.upperCaseFirstLetter(this.currentChild.name));
            } else {
                intepretationText = translate('homeMessageGrowthMeasurementsBad');
            }

            rval.push({
                text: translate('homeMessageGrowthMeasurementEntered') + ' ' + intepretationText,
                iconType: IconType.growth,
            });
        }

        return rval;
    }

    private getEncourageChildDevelopmentMessage(): Message | null {
        let rval: Message | null = null;

        // Validation
        if (this.childAgeInDays === undefined || this.childAgeInDays == 0) return null;

        // Set showMessage
        const showMessage = (this.childAgeInDays % 30) <= 10;

        // Copose message
        if (showMessage) {
            rval = {
                button: {
                    text: translate('homeMessageEncourageChildDevelopment'),
                    type: RoundedButtonType.purple,
                    onPress: () => { navigation.navigate('HomeStackNavigator_EditPeriodScreen') }
                }
            };
        }

        return rval;
    }

    private getUpdateMilestonesMessage(): Message | null {
        let rval: Message | null = null;

        // Validation
        if (!this.currentChild || !this.currentChild.birthDate) return null;
        if (this.childAgeInDays === undefined || this.childAgeInDays == 0) return null;

        // Get all development periods
        const developmentPeriods = translateData('developmentPeriods') as TranslateDataDevelopmentPeriods;

        // Set isTenDaysBefore
        let isTenDaysBefore: boolean = false;
        const childAgeInDays = this.childAgeInDays;

        developmentPeriods?.forEach((period) => {
            const difference = period.daysStart - childAgeInDays;
            if (difference >= 0 && difference <= 10) {
                isTenDaysBefore = true;
            }
        });

        // Set message
        if (isTenDaysBefore) {
            // Set arePreviousMilestonesSet
            const arePreviousMilestonesSet = dataRealmStore.areAllPreviousMilestonesEntered();

            if (!arePreviousMilestonesSet) {
                rval = {
                    button: {
                        text: translate('homeMessageGrowthAddMilestoneButton'),
                        type: RoundedButtonType.purple,
                        onPress: () => {
                            navigation.navigate('HomeStackNavigator_DevelopmentScreen')
                        }
                    }
                };
            }
        }

        return rval;
    }

    private getDoctorVisitAddReminderMessages(): Message[] {
        let rval: Message[] = [];

        // VALIDATION
        if (!this.childAgeInDays || this.childAgeInDays === 0) {
            return [];
        }

        // SET shouldAddRemindersForDoctorVisits
        const shouldAddRemindersForDoctorVisits = userRealmStore.shouldAddRemindersForDoctorVisits(this.childAgeInDays);

        // CREATE MESSAGES
        const allMessages: Message[] = [];

        shouldAddRemindersForDoctorVisits.forEach((doctorVisit) => {
            if (doctorVisit.shouldAddReminder) {
                allMessages.push({
                    text: translate('doctorVisitsPlanDoctorVisitInThisMonth'),
                    iconType: IconType.reminder,
                    button: {
                        text: translate('doctorVisitsAddReminderButton'),
                        type: RoundedButtonType.purple,
                        onPress: () => {
                            navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen');
                        },
                    },
                });
            }
        });

        if (allMessages.length > 0) {
            rval.push(allMessages[0]);
        }

        return rval;
    }

    private getDoctorVisitShowRemindersMessages(): Message[] {
        const rval: Message[] = [];

        const nextActiveReminder = userRealmStore.getActiveReminders()[0];

        if (nextActiveReminder) {

            const reminderDateTime = DateTime.fromMillis(nextActiveReminder.date);
            const reminderPeriodId = userRealmStore.getReminderPeriod(reminderDateTime);

            // SET messageFinal
            let messageFinal = translate('doctorVisitsYouHaveAReminder').replace('%DATE%', reminderDateTime.toLocaleString(DateTime.DATE_MED));

            let dateDiffFromNow = Math.round(reminderDateTime.diffNow('day').days);

            if (dateDiffFromNow === 0) {
                // "doctorVisitTomorowMessage": "TODO Sutra u %TIME% imate zakazan pregled.",
                messageFinal = translate('doctorVisitTodayMessage').replace('%TIME%', DateTime.fromMillis(nextActiveReminder.time).toISOTime().substr(0, 5));
            };

            if (dateDiffFromNow === 1) {
                messageFinal = translate('doctorVisitTomorowMessage').replace('%TIME%', DateTime.fromMillis(nextActiveReminder.time).toISOTime().substr(0, 5));
            }

            // SET immunizationPeriod
            // let immunizationPeriod: TranslateDataImmunizationsPeriod | null = null;

            // if (reminderPeriodId) {
            //     immunizationPeriod = getImmunizationPeriodForDoctorVisitPeriod(reminderPeriodId);
            // }

            // // SET messageVaccines
            // if (immunizationPeriod) {
            //     let messageVaccines: string | null = null;

            //     messageVaccines = immunizationPeriod.vaccines.map((vaccine) => {
            //         return '• ' + vaccine.title;
            //     }).join("\n");

            //     messageFinal += '\n' + messageVaccines;
            // }

            // CREATE MESSAGE
            rval.push({
                text: messageFinal,
                iconType: IconType.reminder,
                textButton: {
                    color: TextButtonColor.purple,
                    text: translate('updateDoctorVisitReminder'),
                    onPress: () => { navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen', { reminder: nextActiveReminder }) },
                },
            });
        }

        return rval;
    }

    private getDoctorVisitMissedRemindersMessages(): Message[] {
        const rval: Message[] = [];
        const missedReminders = userRealmStore.getMissedReminders();
        missedReminders.forEach((missedReminder) => {
            const reminderDateTime = DateTime.fromMillis(missedReminder.date);
            let message = translate('doctorVisitsMissedReminder').replace('%DATE%', reminderDateTime.toLocaleString(DateTime.DATE_MED));

            rval.push({
                text: message,
                iconType: IconType.reminder,
                button: {
                    type: RoundedButtonType.purple,
                    text: translate('doctorVisitsAddMeasuresButton'),
                    onPress: () => { navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen', { screenType: NewDoctorVisitScreenType.HeltCheckUp }) },
                },
                textButton: {
                    color: TextButtonColor.purple,
                    text: translate('updateDoctorVisitReminder'),
                    onPress: () => { navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen', { reminder: missedReminder }) },
                }
            });
        });

        return rval;
    }

    private currentHealthCheckPeriod(): TranslateDataGrowthMessagesPeriod | null {
        let rval: TranslateDataGrowthMessagesPeriod | null = null;

        // Validation
        if (this.childAgeInDays === undefined || this.childAgeInDays == 0) return null;

        // Set growthPeriodsMessages
        let growthPeriodsMessages = translateData('growthPeriodsMessages') as (TranslateDataGrowthPeriodsMessages | null);

        if (!growthPeriodsMessages || growthPeriodsMessages.length === 0) {
            return null;
        }

        // Go over all growthPeriodsMessages
        const childAgeInDays = this.childAgeInDays;

        growthPeriodsMessages.forEach((period) => {
            if (
                childAgeInDays >= period.showGrowthMessageInDays.from
                && childAgeInDays <= period.showGrowthMessageInDays.to
            ) {
                rval = period;
            }
        });

        return rval;
    }

    private measuresForHealthCheckPeriod(healthCheckPeriod: TranslateDataGrowthMessagesPeriod | null): Measures | null {
        let rval: Measures | null = null;

        // Validation
        if (!this.currentChild || !this.currentChild.measures) {
            return null;
        }

        if (!healthCheckPeriod || !healthCheckPeriod.childAgeInDays.from || !healthCheckPeriod.childAgeInDays.to) {
            return null;
        }

        // Set allMesaures
        const allMeasures = JSON.parse(this.currentChild.measures) as Measures[];

        // Set importantMeasures
        const importantMeasures: Measures[] = [];

        allMeasures.forEach((measure) => {
            const childBirtDateTimestampMills = this.currentChild?.birthDate?.getTime();
            const currentMesaureDateTimestampMills = measure.measurementDate;

            if (
                childBirtDateTimestampMills
                && currentMesaureDateTimestampMills
                && currentMesaureDateTimestampMills >= childBirtDateTimestampMills
            ) {
                const measureChildAgeInDays = Math.ceil((currentMesaureDateTimestampMills / 1000 - childBirtDateTimestampMills / 1000) / (60 * 60 * 24));

                if (
                    measureChildAgeInDays >= healthCheckPeriod?.childAgeInDays.from
                    && measureChildAgeInDays <= healthCheckPeriod?.childAgeInDays.to
                ) {
                    importantMeasures.push(measure);
                }
            }
        });

        // Set newestImportantMeasure
        importantMeasures.sort((a, b) => {
            if (!a.measurementDate || !b.measurementDate) return 0;
            if (a.measurementDate > b.measurementDate) return -1;
            if (a.measurementDate < b.measurementDate) return 1;
            if (a.measurementDate == b.measurementDate) return 0;
            return 0;
        });

        // Return the latest measure
        if (importantMeasures && importantMeasures.length > 0) {
            rval = importantMeasures[0];
        }

        return rval;
    }
}

export interface DailyMessageVariable {
    messageId: number;
    messageText: string;
    day: number;
    month: number;
    year: number;
}

export const homeMessages = HomeMessages.getInstance();