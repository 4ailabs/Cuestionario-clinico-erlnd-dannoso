
import React, { useState, useCallback, useMemo } from 'react';
import type { FormData, Medication } from './types';
import { Section, SubSection } from './components/Section';
import { InputField, RadioGroup, CheckboxField, TextareaField, SliderField, SelectField, CheckboxGroup } from './components/FormElements';

const initialFormData: FormData = {
  patientInfo: { evaluationDate: '', patientName: '', birthDate: '', age: '', deliveryDate: '', postpartumWeeks: '' },
  section1: {
    anthropometric: { currentWeight: '', height: '', bmi: '', prePregnancyWeight: '', prePregnancyBmi: '', endPregnancyWeight: '', totalWeightGain: '', postpartumWeightLoss: '' },
    sociodemographic: { occupation: '', physicalActivity: '', homeHelp: '', homeHelpProvider: '', sleepHours: '', interruptedSleep: '' },
  },
  section2: {
    diagnosis: { edsDiagnosisDate: '', geneticTest: '', mutation: '', mutationDetails: '', familyHistory: '', familyMember: '' },
    cutaneous: { skinExtensibility: 5, atrophicScars: '', scarLocation: '', woundDehiscence: '', easyBruising: '', bruisingFrequency: '', episiotomyComplications: '', complicationDetails: '' },
    articular: { beightonThumbRight: false, beightonThumbLeft: false, beightonPinkyRight: false, beightonPinkyLeft: false, beightonElbowRight: false, beightonElbowLeft: false, beightonKneeRight: false, beightonKneeLeft: false, beightonPalms: false, dislocations: '', shoulderDislocationFreq: 'Nunca', patellaDislocationFreq: 'Nunca', fingerDislocationFreq: 'Nunca', otherDislocation: '', subluxations: '', subluxationFreq: '' },
    comorbidities: { spontaneousOrganRupture: false, pelvicOrganProlapse: false, hernia: false, herniaType: '', earlyVaricoseVeins: false, pots: false, dysautonomia: false, mcas: false, gerd: false, functionalGiDisorders: false, anxiety: false, depression: false },
    functionalImpact: { interferesWithDailyActivities: '', interferenceScore: 0, assistanceDevices: { splints: false, cane: false, crutches: false, wheelchair: false, other: false, otherDevice: '' } },
    treatment: { physiotherapy: '', physioFrequency: '', collagenSupplements: '', collagenType: '', painMeds: { nsaids: false, nsaidsType: '', opioids: false, opioidsType: '', other: false, otherPainMeds: '' } },
  },
  section3: {
    diagnosis: { diagnosisDate: '', howDiagnosed: [] },
    labs: { date: '', glucoseFasting: '', insulinFasting: '', homaIr: '', hba1c: '', cPeptide: '', totalCholesterol: '', ldl: '', hdl: '', triglycerides: '', triglycerideHdlRatio: '' },
    symptoms: { carbCravings: 0, postMealFatigue: 0, weightLossDifficulty: 0, abdominalWeightGain: 0, brainFog: 0, fluctuatingEnergy: 0 },
    riskFactors: { gestationalDiabetes: '', requiredInsulin: '', gestationalHypertension: '', pcos: '', familyHistoryT2D: '', familyMember: '' },
    treatment: { metformin: false, metforminDosage: '', otherMeds: false, otherMedsDesc: '', specificDiet: [], otherDiet: '' },
  },
  section4: {
      diagnosis: { diagnosisDate: '', diagnosedBy: '', otherDiagnosedBy: '', confirmationStudies: [] },
      labs: { date: '', crp: '', hsCrp: '', esr: '', rf: '', antiCcp: '', ana: '' },
      joints: { affected: [], pattern: '' },
      pain: { rest: 0, activity: 0, night: 0, morningStiffness: '', stiffnessDuration: '' },
      haq: { dressing: '0', arising: '0', eating: '0', walking: '0', hygiene: '0', reaching: '0', gripping: '0', errands: '0' },
      qualityOfLife: { interferesWithBabyCare: '', interferenceScore: 0, interferesWithLactation: '', lactationInterferenceDetails: '' },
      treatment: { nsaids: false, nsaidsDesc: '', paracetamol: false, paracetamolDesc: '', corticosteroids: false, corticosteroidsDesc: '', dmards: false, dmardsDesc: '', biologics: false, biologicsDesc: '', physiotherapy: false, physioFreq: '', occupationalTherapy: false, heatCold: false, acupuncture: false, massage: false, otherNonPharma: false, otherNonPharmaDesc: '', glucosamine: false, glucosamineDosage: '', chondroitin: false, chondroitinDosage: '', msm: false, msmDosage: '', collagen: false, collagenDosage: '', otherSupplements: false, otherSupplementsDesc: '' },
  },
  section5: {
      pregnancyHistory: { gravida: '', para: '', deliveryType: '', cesareanReason: '', complications: '', complicationDetails: '', edsComplications: '', edsComplicationDetails: '' },
      lactation: { currentlyBreastfeeding: '', stoppedDate: '', stoppedReason: '', lactationType: '', proportionBreastmilk: '', proportionFormula: '', frequencyDay: '', frequencyNight: '', avgDuration: '', pumping: '', pumpFrequency: '', pumpAmount: '' },
      milkProduction: { satisfied: '', concerns: [] },
      babyGrowth: { birthWeight: '', currentWeight: '', currentWeightDate: '', gainingWeight: '', wetDiapers: '', dirtyDiapers: '' },
      postpartumRecovery: { firstMenstruation: '', firstMenstruationDate: '', recoveryRating: '', complications: [] },
      epds: { q1: '0', q2: '0', q3: '0', q4: '0', q5: '0', q6: '0', q7: '0', q8: '0', q9: '0', q10: '0' },
  },
  section6: {
    dietaryHistory: { mealsPerDay: '', snacksPerDay: '', breakfastTime: '', lunchTime: '', dinnerTime: '', snackTimes: '' },
    recall24h: { breakfast: '', morningSnack: '', lunch: '', afternoonSnack: '', dinner: '', eveningSnack: '', water: '', coffee: '', tea: '', juice: '', soda: '', otherDrinks: '' },
    foodFrequency: { fish: '', seafood: '', poultry: '', redMeat: '', pork: '', eggs: '', legumes: '', tofu: '', milk: '', yogurt: '', cheese: '', whiteBread: '', wholeBread: '', whiteRice: '', brownRice: '', pasta: '', oats: '', cereals: '', freshFruits: '', rawVeggies: '', cookedVeggies: '', fruitJuices: '', oliveOil: '', otherOils: '', butter: '', avocado: '', nuts: '', fastFood: '', frozenMeals: '', processedSnacks: '', sweets: '', sugaryDrinks: '' },
    restrictions: { patterns: [], allergies: '', allergiesDesc: '', intolerances: '', intolerancesDesc: '', avoidedFoods: '' },
    giSymptoms: { bloating: '0', gas: '0', abdominalPain: '0', constipation: '0', diarrhea: '0', nausea: '0', heartburn: '0', earlySatiety: '0', relatedToFood: '', relatedFoods: '' },
    hydration: { fluidIntake: '', mainFluids: '', excessiveThirst: '', urineColor: '' },
  },
  section7: {
    supplements: { takingSupplements: '', multivitamin: false, multivitaminName: '', multivitaminDose: '', vitaminD: false, vitaminDDose: '', vitaminC: false, vitaminCDose: '', calcium: false, calciumDose: '', magnesium: false, magnesiumDose: '', iron: false, ironDose: '', zinc: false, zincDose: '', omega3: false, omega3Dose: '', vitaminB12: false, vitaminB12Dose: '', folate: false, folateDose: '' },
    specificSupplements: { collagenPeptides: false, collagenDose: '', glycine: false, glycineDose: '', lysine: false, lysineDose: '', proline: false, prolineDose: '', vitaminK2: false, vitaminK2Dose: '', silicon: false, siliconDose: '', copper: false, copperDose: '', manganese: false, manganeseDose: '', inositol: false, inositolDose: '', berberine: false, berberineDose: '', chromium: false, chromiumDose: '', ala: false, alaDose: '', cinnamon: false, cinnamonDose: '', turmeric: false, turmericDose: '', boswellia: false, boswelliaDose: '', ginger: false, gingerDose: '', quercetin: false, quercetinDose: '', msm: false, msmDose: '', glucosamine: false, glucosamineDose: '', chondroitin: false, chondroitinDose: '', probiotics: false, probioticsName: '', other1Name: '', other1Dose: '', other2Name: '', other2Dose: '' },
    adherence: { consistency: '', sideEffects: '', sideEffectsDesc: '', barriers: [], otherBarrier: '' },
  },
  section8: {
    medications: [{ name: '', dose: '', freq: '', reason: '', since: '' }],
    otcPainkillers: { ibuprofen: false, ibuprofenDose: '', naproxen: false, naproxenDose: '', paracetamol: false, paracetamolDose: '', aspirin: false, aspirinDose: '', other: false, otherDesc: '', frequency: '' },
    contraception: { method: '', otherDesc: '' },
    mentalHealthMeds: { antidepressants: false, antidepressantsDesc: '', anxiolytics: false, anxiolyticsDesc: '', other: false, otherDesc: '' },
    allergies: { hasAllergies: '', allergiesDesc: '' },
  },
  section9: {
    familyHistory: { t2d: '', t2dWho: '', cardiovascular: '', cardiovascularWho: '', hypertension: '', hypertensionWho: '', eds: '', edsWho: '', hypermobility: '', hypermobilityWho: '', ra: '', raWho: '', oa: '', oaWho: '', autoimmune: '', autoimmuneDesc: '', obesity: '', obesityWho: '', pcos: '', pcosWho: '', thyroid: '', thyroidWho: '', celiac: '', celiacWho: '' },
  },
  section10: {
    generalSymptoms: { fatigue: 0, morningEnergy: 0, postMealEnergyDip: 0, fatigueInterference: 0, sleepDifficulty: 0, nightWaking: 0, unrefreshingSleep: 0, sadness: 0, anxiety: 0, irritability: 0, apathy: 0, concentrationDifficulty: 0, poorMemory: 0, brainFog: 0, sweetCravings: 0, excessiveHunger: 0, poorAppetite: 0 },
    specificSymptoms: { hypoTremors: '', hypoSweating: '', hypoDizziness: '', hypoConfusion: '', hypoHunger: '', hypoIrritability: '', easyBruising: 0, fragileSkin: 0, slowHealing: 0, unexplainedStretchMarks: '', dizzyOnStanding: '', palpitations: '', heatIntolerance: '', tempRegulation: '' },
    postpartumChanges: [],
  },
  section11: {
    physicalActivity: { prePregnancyType: '', prePregnancyFreq: '', prePregnancyDuration: '', prePregnancyIntensity: '', currentActivity: '', currentType: '', currentFreq: '', currentDuration: '', painLimitsActivity: '' },
    dailyLife: { standingHours: '', sittingHours: '', lyingHours: '' },
    stress: { level: 0, sources: [], otherSource: '', management: [], otherManagement: '' },
    environment: { tobacco: false, alcohol: '', alcoholAmount: '', toxins: false, toxinsDesc: '', mold: false, pets: false, petsDesc: '' },
    socialSupport: { livesWith: [], otherLivesWith: '', emotionalSupport: 0, practicalSupport: 0, isolationLevel: 0 },
  },
  section12: {
    goals: { concern1: '', concern2: '', concern3: '', nutritionGoals: [], otherGoal: '' },
    barriers: { anticipated: [], otherBarrier: '' },
    resources: { preparesMeals: '', otherMealPrep: '', hasAccessTo: [], timeForPrep: '' },
    motivation: { foodChanges: 5, supplementChanges: 5, motivators: [], otherMotivator: '' },
  },
  section13: {
    micronutrients: { date: '', vitD: '', vitB12: '', folate: '', ferritin: '', serumIron: '', transferrinSat: '', tibc: '', rbcMagnesium: '', serumZinc: '' },
    thyroid: { date: '', tsh: '', freeT4: '', freeT3: '', tpoAb: '', tgAb: '' },
    other: { homocysteine: '', vitA: '', vitE: '', selenium: '', serumCopper: '', ceruloplasmin: '' },
  },
  consent: { patientSignature: '', patientDate: '' },
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const keys = name.split('.');
    
    setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev)); // Deep copy
        let current: any = newState;

        for(let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }

        const target = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            if (Array.isArray(current[keys[keys.length - 1]])) {
                const arr = current[keys[keys.length - 1]] as string[];
                if (target.checked) {
                    if (!arr.includes(value)) {
                       arr.push(value);
                    }
                } else {
                    const index = arr.indexOf(value);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                }
            } else {
                 current[keys[keys.length - 1]] = target.checked;
            }
        } else {
             current[keys[keys.length - 1]] = value;
        }
        return newState;
    });
  }, []);
  
  const handleMedicationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.split('.').pop() as keyof Medication;
    setFormData(prev => {
        const newMeds = [...prev.section8.medications];
        newMeds[index] = { ...newMeds[index], [fieldName]: value };
        return {
            ...prev,
            section8: {
                ...prev.section8,
                medications: newMeds
            }
        };
    });
};


  const addMedicationRow = () => {
    setFormData(prev => ({
        ...prev,
        section8: {
            ...prev.section8,
            medications: [
                ...prev.section8.medications,
                { name: '', dose: '', freq: '', reason: '', since: '' }
            ]
        }
    }));
};

const removeMedicationRow = (index: number) => {
    setFormData(prev => ({
        ...prev,
        section8: {
            ...prev.section8,
            medications: prev.section8.medications.filter((_, i) => i !== index)
        }
    }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Cuestionario enviado exitosamente! Recibirás una confirmación por correo.');
        // Opcional: resetear el formulario
        // setFormData(initialFormData);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };
  
  const beightonScore = useMemo(() => {
    const { articular } = formData.section2;
    let score = 0;
    if (articular.beightonThumbRight) score++;
    if (articular.beightonThumbLeft) score++;
    if (articular.beightonPinkyRight) score++;
    if (articular.beightonPinkyLeft) score++;
    if (articular.beightonElbowRight) score++;
    if (articular.beightonElbowLeft) score++;
    if (articular.beightonKneeRight) score++;
    if (articular.beightonKneeLeft) score++;
    if (articular.beightonPalms) score++;
    return score;
  }, [formData.section2.articular]);

  const haqScore = useMemo(() => {
    const { haq } = formData.section4;
    const values = Object.values(haq);
    if (values.length === 0) return '0.00';
    const score = (
        values.reduce((sum, value) => sum + parseInt(value || '0', 10), 0) / values.length
    ).toFixed(2);
    return isNaN(parseFloat(score)) ? '0.00' : score;
  }, [formData.section4.haq]);

  const epdsScore = useMemo(() => {
    const { epds } = formData.section5;
    return Object.values(epds).reduce((sum, value) => sum + parseInt(value || '0', 10), 0);
  }, [formData.section5.epds]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 tracking-tight px-4">
            Cuestionario Integral
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-teal-600 font-semibold px-4">Para Evaluación Nutricional</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Patient Info */}
          <Section title="Información del Paciente">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <InputField label="Fecha de evaluación" name="patientInfo.evaluationDate" type="date" value={formData.patientInfo.evaluationDate} onChange={handleInputChange} />
                 <InputField label="Nombre del paciente" name="patientInfo.patientName" value={formData.patientInfo.patientName} onChange={handleInputChange} />
                 <InputField label="Fecha de nacimiento" name="patientInfo.birthDate" type="date" value={formData.patientInfo.birthDate} onChange={handleInputChange} />
                 <InputField label="Edad" name="patientInfo.age" type="number" value={formData.patientInfo.age} onChange={handleInputChange} />
                 <InputField label="Fecha del parto" name="patientInfo.deliveryDate" type="date" value={formData.patientInfo.deliveryDate} onChange={handleInputChange} />
                 <InputField label="Semanas postparto" name="patientInfo.postpartumWeeks" type="number" value={formData.patientInfo.postpartumWeeks} onChange={handleInputChange} />
             </div>
          </Section>
          
          {/* Section 1 */}
          <Section title="SECCIÓN 1: INFORMACIÓN DEMOGRÁFICA Y GENERAL">
            <SubSection title="1.1 Datos antropométricos">
                <InputField label="Peso actual" name="section1.anthropometric.currentWeight" type="number" value={formData.section1.anthropometric.currentWeight} onChange={handleInputChange} unit="kg" />
                <InputField label="Talla" name="section1.anthropometric.height" type="number" value={formData.section1.anthropometric.height} onChange={handleInputChange} unit="cm" />
                <InputField label="IMC" name="section1.anthropometric.bmi" type="number" value={formData.section1.anthropometric.bmi} onChange={handleInputChange} unit="kg/m²" />
                <InputField label="Peso pre-embarazo" name="section1.anthropometric.prePregnancyWeight" type="number" value={formData.section1.anthropometric.prePregnancyWeight} onChange={handleInputChange} unit="kg" />
                <InputField label="IMC pre-embarazo" name="section1.anthropometric.prePregnancyBmi" type="number" value={formData.section1.anthropometric.prePregnancyBmi} onChange={handleInputChange} />
                <InputField label="Peso al final del embarazo" name="section1.anthropometric.endPregnancyWeight" type="number" value={formData.section1.anthropometric.endPregnancyWeight} onChange={handleInputChange} unit="kg" />
                <InputField label="Ganancia total de peso durante embarazo" name="section1.anthropometric.totalWeightGain" type="number" value={formData.section1.anthropometric.totalWeightGain} onChange={handleInputChange} unit="kg" />
                <InputField label="Pérdida de peso postparto hasta la fecha" name="section1.anthropometric.postpartumWeightLoss" type="number" value={formData.section1.anthropometric.postpartumWeightLoss} onChange={handleInputChange} unit="kg" />
            </SubSection>
            <SubSection title="1.2 Información sociodemográfica">
                <InputField label="Ocupación" name="section1.sociodemographic.occupation" value={formData.section1.sociodemographic.occupation} onChange={handleInputChange} className="md:col-span-2 lg:col-span-3"/>
                <RadioGroup 
                    label="Nivel de actividad física"
                    name="section1.sociodemographic.physicalActivity"
                    value={formData.section1.sociodemographic.physicalActivity}
                    onChange={handleInputChange}
                    className="md:col-span-2 lg:col-span-3"
                    options={[
                        { label: 'Sedentaria', value: 'sedentary' },
                        { label: 'Ligeramente activa', value: 'light' },
                        { label: 'Moderadamente activa', value: 'moderate' },
                        { label: 'Muy activa', value: 'very' },
                        { label: 'Extremadamente activa', value: 'extreme' },
                    ]}
                />
                <RadioGroup 
                    label="¿Tiene ayuda en casa para el cuidado del bebé?"
                    name="section1.sociodemographic.homeHelp"
                    value={formData.section1.sociodemographic.homeHelp}
                    onChange={handleInputChange}
                    options={[{ label: 'Sí', value: 'yes' }, { label: 'No', value: 'no' }]}
                />
                 {formData.section1.sociodemographic.homeHelp === 'yes' && (
                    <InputField label="Si sí, ¿de quién?" name="section1.sociodemographic.homeHelpProvider" value={formData.section1.sociodemographic.homeHelpProvider} onChange={handleInputChange} />
                )}
                <InputField label="¿Cuántas horas de sueño obtiene por noche (promedio)?" name="section1.sociodemographic.sleepHours" type="number" value={formData.section1.sociodemographic.sleepHours} onChange={handleInputChange} unit="horas" />
                <RadioGroup 
                    label="¿El sueño es interrumpido frecuentemente?"
                    name="section1.sociodemographic.interruptedSleep"
                    value={formData.section1.sociodemographic.interruptedSleep}
                    onChange={handleInputChange}
                    options={[{ label: 'Sí', value: 'yes' }, { label: 'No', value: 'no' }]}
                />
            </SubSection>
          </Section>

          {/* Section 2 */}
          <Section title="SECCIÓN 2: HISTORIA CLÍNICA - SÍNDROME DE EHLERS-DANLOS CLÁSICO">
            <SubSection title="2.1 Diagnóstico y genética">
                <InputField label="Fecha de diagnóstico de EDS clásico" name="section2.diagnosis.edsDiagnosisDate" type="date" value={formData.section2.diagnosis.edsDiagnosisDate} onChange={handleInputChange} />
                <RadioGroup label="¿Se realizó prueba genética molecular?" name="section2.diagnosis.geneticTest" value={formData.section2.diagnosis.geneticTest} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section2.diagnosis.geneticTest === 'yes' && (<>
                    <RadioGroup label="Mutación identificada" name="section2.diagnosis.mutation" value={formData.section2.diagnosis.mutation} onChange={handleInputChange} options={[{label: 'COL5A1', value: 'COL5A1'}, {label: 'COL5A2', value: 'COL5A2'}, {label: 'Desconocido', value: 'unknown'}]} />
                    <InputField label="Especificar mutación si conoce" name="section2.diagnosis.mutationDetails" value={formData.section2.diagnosis.mutationDetails} onChange={handleInputChange} />
                </>)}
                <RadioGroup label="¿Hay historia familiar de EDS?" name="section2.diagnosis.familyHistory" value={formData.section2.diagnosis.familyHistory} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section2.diagnosis.familyHistory === 'yes' && (
                    <InputField label="Si sí, ¿quién?" name="section2.diagnosis.familyMember" value={formData.section2.diagnosis.familyMember} onChange={handleInputChange} />
                )}
            </SubSection>
            <SubSection title="2.2 Manifestaciones cutáneas">
                 <SliderField label="Extensibilidad de la piel (0-10)" name="section2.cutaneous.skinExtensibility" value={formData.section2.cutaneous.skinExtensibility} onChange={handleInputChange} />
                 <RadioGroup label="¿Tiene cicatrices atróficas?" name="section2.cutaneous.atrophicScars" value={formData.section2.cutaneous.atrophicScars} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                 {formData.section2.cutaneous.atrophicScars === 'yes' && (
                    <InputField label="Ubicación" name="section2.cutaneous.scarLocation" value={formData.section2.cutaneous.scarLocation} onChange={handleInputChange} />
                 )}
                 <RadioGroup label="¿Ha tenido dehiscencia de heridas?" name="section2.cutaneous.woundDehiscence" value={formData.section2.cutaneous.woundDehiscence} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                 <RadioGroup label="¿Experimenta fragilidad cutánea con moretones fáciles?" name="section2.cutaneous.easyBruising" value={formData.section2.cutaneous.easyBruising} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                 {formData.section2.cutaneous.easyBruising === 'yes' && (
                    <SelectField label="Frecuencia" name="section2.cutaneous.bruisingFrequency" value={formData.section2.cutaneous.bruisingFrequency} onChange={handleInputChange} options={[{label: 'Diaria', value: 'daily'}, {label: 'Semanal', value: 'weekly'}, {label: 'Mensual', value: 'monthly'}, {label: 'Rara', value: 'rare'}]} />
                 )}
                 <RadioGroup label="¿Ha tenido complicaciones en episiotomía o cesárea?" name="section2.cutaneous.episiotomyComplications" value={formData.section2.cutaneous.episiotomyComplications} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                 {formData.section2.cutaneous.episiotomyComplications === 'yes' && (
                    <TextareaField label="Detalles" name="section2.cutaneous.complicationDetails" value={formData.section2.cutaneous.complicationDetails} onChange={handleInputChange} />
                 )}
            </SubSection>
            <SubSection title="2.3 Manifestaciones articulares">
                <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">Hipermovilidad articular (Escala de Beighton):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 pl-2 sm:pl-4">
                        <CheckboxField label="Pulgar a antebrazo (Derecha)" name="section2.articular.beightonThumbRight" checked={formData.section2.articular.beightonThumbRight} onChange={handleInputChange} />
                        <CheckboxField label="Pulgar a antebrazo (Izquierda)" name="section2.articular.beightonThumbLeft" checked={formData.section2.articular.beightonThumbLeft} onChange={handleInputChange} />
                        <CheckboxField label="Meñique > 90° (Derecha)" name="section2.articular.beightonPinkyRight" checked={formData.section2.articular.beightonPinkyRight} onChange={handleInputChange} />
                        <CheckboxField label="Meñique > 90° (Izquierda)" name="section2.articular.beightonPinkyLeft" checked={formData.section2.articular.beightonPinkyLeft} onChange={handleInputChange} />
                        <CheckboxField label="Codo > 10° (Derecha)" name="section2.articular.beightonElbowRight" checked={formData.section2.articular.beightonElbowRight} onChange={handleInputChange} />
                        <CheckboxField label="Codo > 10° (Izquierda)" name="section2.articular.beightonElbowLeft" checked={formData.section2.articular.beightonElbowLeft} onChange={handleInputChange} />
                        <CheckboxField label="Rodilla > 10° (Derecha)" name="section2.articular.beightonKneeRight" checked={formData.section2.articular.beightonKneeRight} onChange={handleInputChange} />
                        <CheckboxField label="Rodilla > 10° (Izquierda)" name="section2.articular.beightonKneeLeft" checked={formData.section2.articular.beightonKneeLeft} onChange={handleInputChange} />
                        <CheckboxField label="Palmas al suelo" name="section2.articular.beightonPalms" checked={formData.section2.articular.beightonPalms} onChange={handleInputChange} className="sm:col-span-2"/>
                    </div>
                </div>
                 <div className="flex items-center justify-between sm:justify-start sm:space-x-3 bg-teal-50 p-3 rounded-lg sm:col-span-2 lg:col-span-3">
                    <label className="text-sm font-bold text-teal-800">Puntaje Beighton total:</label>
                    <span className="text-lg font-bold text-teal-600">{beightonScore} / 9</span>
                 </div>
                 <RadioGroup label="¿Ha experimentado dislocaciones articulares?" name="section2.articular.dislocations" value={formData.section2.articular.dislocations} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} className="sm:col-span-2 lg:col-span-3" />
                 {formData.section2.articular.dislocations === 'yes' && (<>
                    <SelectField label="Hombros Frecuencia" name="section2.articular.shoulderDislocationFreq" value={formData.section2.articular.shoulderDislocationFreq} onChange={handleInputChange} options={[{label:'Nunca', value: 'Nunca'}, {label:'1-2 veces', value: '1-2'}, {label:'3-5 veces', value: '3-5'}, {label:'> 5 veces', value: '>5'}, {label:'Recurrente', value: 'recurrente'}]} />
                    <SelectField label="Rótulas Frecuencia" name="section2.articular.patellaDislocationFreq" value={formData.section2.articular.patellaDislocationFreq} onChange={handleInputChange} options={[{label:'Nunca', value: 'Nunca'}, {label:'1-2 veces', value: '1-2'}, {label:'3-5 veces', value: '3-5'}, {label:'> 5 veces', value: '>5'}, {label:'Recurrente', value: 'recurrente'}]} />
                    <SelectField label="Dedos Frecuencia" name="section2.articular.fingerDislocationFreq" value={formData.section2.articular.fingerDislocationFreq} onChange={handleInputChange} options={[{label:'Nunca', value: 'Nunca'}, {label:'1-2 veces', value: '1-2'}, {label:'3-5 veces', value: '3-5'}, {label:'> 5 veces', value: '>5'}, {label:'Recurrente', value: 'recurrente'}]} />
                    <InputField label="Otras" name="section2.articular.otherDislocation" value={formData.section2.articular.otherDislocation} onChange={handleInputChange} />
                 </>)}
                 <RadioGroup label="¿Ha tenido subluxaciones?" name="section2.articular.subluxations" value={formData.section2.articular.subluxations} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                 {formData.section2.articular.subluxations === 'yes' && (
                    <SelectField label="Frecuencia" name="section2.articular.subluxationFreq" value={formData.section2.articular.subluxationFreq} onChange={handleInputChange} options={[{label: 'Diaria', value: 'daily'}, {label: 'Semanal', value: 'weekly'}, {label: 'Mensual', value: 'monthly'}, {label: 'Rara', value: 'rare'}]} />
                 )}
            </SubSection>
            <SubSection title="2.4 Complicaciones y comorbilidades de EDS">
                <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">¿Ha tenido alguna de las siguientes?</p>
                    <div className="space-y-3 sm:space-y-2">
                        <CheckboxField label="Ruptura espontánea de órganos" name="section2.comorbidities.spontaneousOrganRupture" checked={formData.section2.comorbidities.spontaneousOrganRupture} onChange={handleInputChange}/>
                        <CheckboxField label="Prolapso de órganos pélvicos" name="section2.comorbidities.pelvicOrganProlapse" checked={formData.section2.comorbidities.pelvicOrganProlapse} onChange={handleInputChange}/>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                           <CheckboxField label="Hernia" name="section2.comorbidities.hernia" checked={formData.section2.comorbidities.hernia} onChange={handleInputChange}/>
                           {formData.section2.comorbidities.hernia && <InputField label="Especificar tipo" name="section2.comorbidities.herniaType" value={formData.section2.comorbidities.herniaType} onChange={handleInputChange} className="sm:flex-1" />}
                        </div>
                        <CheckboxField label="Várices tempranas" name="section2.comorbidities.earlyVaricoseVeins" checked={formData.section2.comorbidities.earlyVaricoseVeins} onChange={handleInputChange}/>
                        <CheckboxField label="Síndrome de taquicardia postural ortostática (POTS)" name="section2.comorbidities.pots" checked={formData.section2.comorbidities.pots} onChange={handleInputChange}/>
                        <CheckboxField label="Disautonomía" name="section2.comorbidities.dysautonomia" checked={formData.section2.comorbidities.dysautonomia} onChange={handleInputChange}/>
                        <CheckboxField label="Síndrome de activación mastocitaria (MCAS)" name="section2.comorbidities.mcas" checked={formData.section2.comorbidities.mcas} onChange={handleInputChange}/>
                        <CheckboxField label="Enfermedad de reflujo gastroesofágico (ERGE)" name="section2.comorbidities.gerd" checked={formData.section2.comorbidities.gerd} onChange={handleInputChange}/>
                        <CheckboxField label="Trastornos gastrointestinales funcionales" name="section2.comorbidities.functionalGiDisorders" checked={formData.section2.comorbidities.functionalGiDisorders} onChange={handleInputChange}/>
                        <CheckboxField label="Ansiedad" name="section2.comorbidities.anxiety" checked={formData.section2.comorbidities.anxiety} onChange={handleInputChange}/>
                        <CheckboxField label="Depresión" name="section2.comorbidities.depression" checked={formData.section2.comorbidities.depression} onChange={handleInputChange}/>
                    </div>
                </div>
            </SubSection>
            <SubSection title="2.5 Impacto funcional del EDS">
                <RadioGroup label="¿El EDS interfiere con sus actividades diarias?" name="section2.functionalImpact.interferesWithDailyActivities" value={formData.section2.functionalImpact.interferesWithDailyActivities} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section2.functionalImpact.interferesWithDailyActivities === 'yes' && (
                    <SliderField label="Califique la interferencia (0-10)" name="section2.functionalImpact.interferenceScore" value={formData.section2.functionalImpact.interferenceScore} onChange={handleInputChange} />
                )}
                <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">¿Usa algún dispositivo de asistencia?</p>
                    <div className="space-y-2">
                        <CheckboxField label="Férulas/ortesis" name="section2.functionalImpact.assistanceDevices.splints" checked={formData.section2.functionalImpact.assistanceDevices.splints} onChange={handleInputChange} />
                        <CheckboxField label="Bastón" name="section2.functionalImpact.assistanceDevices.cane" checked={formData.section2.functionalImpact.assistanceDevices.cane} onChange={handleInputChange} />
                        <CheckboxField label="Muletas" name="section2.functionalImpact.assistanceDevices.crutches" checked={formData.section2.functionalImpact.assistanceDevices.crutches} onChange={handleInputChange} />
                        <CheckboxField label="Silla de ruedas (ocasional/tiempo completo)" name="section2.functionalImpact.assistanceDevices.wheelchair" checked={formData.section2.functionalImpact.assistanceDevices.wheelchair} onChange={handleInputChange} />
                        <div className="flex items-center gap-4">
                           <CheckboxField label="Otro" name="section2.functionalImpact.assistanceDevices.other" checked={formData.section2.functionalImpact.assistanceDevices.other} onChange={handleInputChange}/>
                           {formData.section2.functionalImpact.assistanceDevices.other && <InputField label="Especificar" name="section2.functionalImpact.assistanceDevices.otherDevice" value={formData.section2.functionalImpact.assistanceDevices.otherDevice} onChange={handleInputChange} />}
                        </div>
                    </div>
                </div>
            </SubSection>
            <SubSection title="2.6 Tratamiento actual para EDS">
                <RadioGroup label="¿Está bajo tratamiento fisioterapéutico?" name="section2.treatment.physiotherapy" value={formData.section2.treatment.physiotherapy} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section2.treatment.physiotherapy === 'yes' && (
                    <InputField label="Frecuencia" name="section2.treatment.physioFrequency" value={formData.section2.treatment.physioFrequency} onChange={handleInputChange} />
                )}
                <RadioGroup label="¿Toma actualmente suplementos para el colágeno?" name="section2.treatment.collagenSupplements" value={formData.section2.treatment.collagenSupplements} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section2.treatment.collagenSupplements === 'yes' && (
                    <InputField label="Especifique" name="section2.treatment.collagenType" value={formData.section2.treatment.collagenType} onChange={handleInputChange} />
                )}
                <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Medicamentos para manejo del dolor:</p>
                    <div className="space-y-2 pl-4">
                        <div className="flex items-center gap-4">
                            <CheckboxField label="AINEs" name="section2.treatment.painMeds.nsaids" checked={formData.section2.treatment.painMeds.nsaids} onChange={handleInputChange} />
                            {formData.section2.treatment.painMeds.nsaids && <InputField label=" " name="section2.treatment.painMeds.nsaidsType" value={formData.section2.treatment.painMeds.nsaidsType} onChange={handleInputChange} placeholder="Especifique cuál"/>}
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckboxField label="Opioides" name="section2.treatment.painMeds.opioids" checked={formData.section2.treatment.painMeds.opioids} onChange={handleInputChange} />
                            {formData.section2.treatment.painMeds.opioids && <InputField label=" " name="section2.treatment.painMeds.opioidsType" value={formData.section2.treatment.painMeds.opioidsType} onChange={handleInputChange} placeholder="Especifique cuál"/>}
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckboxField label="Otros" name="section2.treatment.painMeds.other" checked={formData.section2.treatment.painMeds.other} onChange={handleInputChange} />
                            {formData.section2.treatment.painMeds.other && <InputField label=" " name="section2.treatment.painMeds.otherPainMeds" value={formData.section2.treatment.painMeds.otherPainMeds} onChange={handleInputChange} placeholder="Especifique cuál"/>}
                        </div>
                    </div>
                </div>
            </SubSection>
          </Section>

          {/* Section 3 */}
            <Section title="SECCIÓN 3: HISTORIA CLÍNICA - RESISTENCIA A LA INSULINA">
                <SubSection title="3.1 Diagnóstico y evaluación metabólica">
                    <InputField label="¿Cuándo fue diagnosticada con resistencia a la insulina?" name="section3.diagnosis.diagnosisDate" type="date" value={formData.section3.diagnosis.diagnosisDate} onChange={handleInputChange} />
                    <CheckboxGroup 
                        label="¿Cómo fue diagnosticada?"
                        name="section3.diagnosis.howDiagnosed"
                        values={formData.section3.diagnosis.howDiagnosed}
                        onChange={handleInputChange}
                        options={[
                            {label: 'Glucosa en ayuno elevada', value: 'glucose'},
                            {label: 'Insulina en ayuno elevada', value: 'insulin'},
                            {label: 'Prueba de tolerancia oral a la glucosa (PTOG)', value: 'ptog'},
                            {label: 'HbA1c elevada', value: 'hba1c'},
                            {label: 'Diagnóstico clínico sin laboratorios', value: 'clinical'},
                        ]}
                        className="md:col-span-2"
                    />
                </SubSection>
                <SubSection title="3.2 Laboratorios metabólicos recientes (si disponibles)">
                    <InputField label="Fecha del último laboratorio" name="section3.labs.date" type="date" value={formData.section3.labs.date} onChange={handleInputChange} />
                    <InputField label="Glucosa en ayuno" name="section3.labs.glucoseFasting" value={formData.section3.labs.glucoseFasting} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="Insulina en ayuno" name="section3.labs.insulinFasting" value={formData.section3.labs.insulinFasting} onChange={handleInputChange} unit="μU/mL"/>
                    <InputField label="HOMA-IR" name="section3.labs.homaIr" value={formData.section3.labs.homaIr} onChange={handleInputChange} />
                    <InputField label="HbA1c" name="section3.labs.hba1c" value={formData.section3.labs.hba1c} onChange={handleInputChange} unit="%"/>
                    <InputField label="Péptido C" name="section3.labs.cPeptide" value={formData.section3.labs.cPeptide} onChange={handleInputChange} unit="ng/mL"/>
                    <InputField label="Colesterol total" name="section3.labs.totalCholesterol" value={formData.section3.labs.totalCholesterol} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="LDL" name="section3.labs.ldl" value={formData.section3.labs.ldl} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="HDL" name="section3.labs.hdl" value={formData.section3.labs.hdl} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="Triglicéridos" name="section3.labs.triglycerides" value={formData.section3.labs.triglycerides} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="Proporción Triglicéridos/HDL" name="section3.labs.triglycerideHdlRatio" value={formData.section3.labs.triglycerideHdlRatio} onChange={handleInputChange} />
                </SubSection>
                <SubSection title="3.3 Síntomas de resistencia a la insulina (0-10)">
                    <SliderField label="Antojos intensos de carbohidratos/azúcar" name="section3.symptoms.carbCravings" value={formData.section3.symptoms.carbCravings} onChange={handleInputChange}/>
                    <SliderField label="Fatiga después de comer" name="section3.symptoms.postMealFatigue" value={formData.section3.symptoms.postMealFatigue} onChange={handleInputChange}/>
                    <SliderField label="Dificultad para perder peso" name="section3.symptoms.weightLossDifficulty" value={formData.section3.symptoms.weightLossDifficulty} onChange={handleInputChange}/>
                    <SliderField label="Aumento de peso en área abdominal" name="section3.symptoms.abdominalWeightGain" value={formData.section3.symptoms.abdominalWeightGain} onChange={handleInputChange}/>
                    <SliderField label="Sensación de 'neblina mental'" name="section3.symptoms.brainFog" value={formData.section3.symptoms.brainFog} onChange={handleInputChange}/>
                    <SliderField label="Energía fluctuante durante el día" name="section3.symptoms.fluctuatingEnergy" value={formData.section3.symptoms.fluctuatingEnergy} onChange={handleInputChange}/>
                </SubSection>
                 <SubSection title="3.4 Historia previa y factores de riesgo">
                    <RadioGroup label="¿Tuvo diabetes gestacional?" name="section3.riskFactors.gestationalDiabetes" value={formData.section3.riskFactors.gestationalDiabetes} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section3.riskFactors.gestationalDiabetes === 'yes' && (
                        <RadioGroup label="¿Requirió insulina?" name="section3.riskFactors.requiredInsulin" value={formData.section3.riskFactors.requiredInsulin} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    )}
                    <RadioGroup label="¿Tuvo hipertensión gestacional o preeclampsia?" name="section3.riskFactors.gestationalHypertension" value={formData.section3.riskFactors.gestationalHypertension} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    <RadioGroup label="¿Diagnosticada con SOP?" name="section3.riskFactors.pcos" value={formData.section3.riskFactors.pcos} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    <RadioGroup label="Historia familiar de diabetes tipo 2" name="section3.riskFactors.familyHistoryT2D" value={formData.section3.riskFactors.familyHistoryT2D} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section3.riskFactors.familyHistoryT2D === 'yes' && (
                        <InputField label="¿Quién?" name="section3.riskFactors.familyMember" value={formData.section3.riskFactors.familyMember} onChange={handleInputChange} />
                    )}
                </SubSection>
                <SubSection title="3.5 Tratamiento actual para resistencia a insulina">
                    <div className="md:col-span-3 space-y-4">
                        <p className="text-sm font-medium text-gray-700">¿Está tomando medicamentos para control glucémico?</p>
                        <div className="flex items-center gap-4">
                            <CheckboxField label="Metformina" name="section3.treatment.metformin" checked={formData.section3.treatment.metformin} onChange={handleInputChange} />
                            {formData.section3.treatment.metformin && <InputField label="Dosis y frecuencia" name="section3.treatment.metforminDosage" value={formData.section3.treatment.metforminDosage} onChange={handleInputChange} placeholder="e.g., 500mg, 2 veces/día" />}
                        </div>
                         <div className="flex items-center gap-4">
                            <CheckboxField label="Otros" name="section3.treatment.otherMeds" checked={formData.section3.treatment.otherMeds} onChange={handleInputChange} />
                            {formData.section3.treatment.otherMeds && <InputField label="Especifique" name="section3.treatment.otherMedsDesc" value={formData.section3.treatment.otherMedsDesc} onChange={handleInputChange} />}
                        </div>
                    </div>
                     <div className="md:col-span-3 space-y-4">
                        <CheckboxGroup 
                            label="¿Sigue alguna dieta específica actualmente?"
                            name="section3.treatment.specificDiet"
                            values={formData.section3.treatment.specificDiet}
                            onChange={handleInputChange}
                            options={[
                                {label: 'Baja en carbohidratos', value: 'low_carb'},
                                {label: 'Cetogénica', value: 'keto'},
                                {label: 'Mediterránea', value: 'mediterranean'},
                                {label: 'Baja en índice glucémico', value: 'low_gi'},
                                {label: 'Sin dieta específica', value: 'none'},
                            ]}
                        />
                         <InputField label="Otra dieta" name="section3.treatment.otherDiet" value={formData.section3.treatment.otherDiet} onChange={handleInputChange} placeholder="Especifique si seleccionó 'Otra' o agregue detalles" />
                    </div>
                </SubSection>
            </Section>
          
           {/* Section 4 */}
           <Section title="SECCIÓN 4: HISTORIA CLÍNICA - ARTRITIS NO REACTIVA">
             <SubSection title="4.1 Diagnóstico y caracterización">
                <InputField label="Fecha de diagnóstico" name="section4.diagnosis.diagnosisDate" type="date" value={formData.section4.diagnosis.diagnosisDate} onChange={handleInputChange} />
                <RadioGroup label="¿Quién realizó el diagnóstico?" name="section4.diagnosis.diagnosedBy" value={formData.section4.diagnosis.diagnosedBy} onChange={handleInputChange} options={[{label: 'Reumatólogo', value: 'reumatologo'}, {label: 'Médico general', value: 'general'}, {label: 'Otro', value: 'otro'}]} />
                {formData.section4.diagnosis.diagnosedBy === 'otro' && (
                    <InputField label="Especifique 'Otro'" name="section4.diagnosis.otherDiagnosedBy" value={formData.section4.diagnosis.otherDiagnosedBy} onChange={handleInputChange} />
                )}
                 <CheckboxGroup
                    label="¿Se realizaron estudios para confirmar?"
                    name="section4.diagnosis.confirmationStudies"
                    values={formData.section4.diagnosis.confirmationStudies}
                    onChange={handleInputChange}
                    options={[
                        {label: 'Análisis de sangre (PCR, VSG, FR)', value: 'blood'},
                        {label: 'Rayos X de articulaciones', value: 'xray'},
                        {label: 'Resonancia magnética', value: 'mri'},
                        {label: 'Ecografía articular', value: 'ultrasound'},
                        {label: 'Análisis de líquido sinovial', value: 'synovial_fluid'},
                    ]}
                    className="md:col-span-2"
                />
             </SubSection>
            <SubSection title="4.2 Laboratorios inflamatorios recientes">
                <InputField label="Fecha" name="section4.labs.date" type="date" value={formData.section4.labs.date} onChange={handleInputChange} />
                <InputField label="Proteína C reactiva (PCR)" name="section4.labs.crp" value={formData.section4.labs.crp} onChange={handleInputChange} unit="mg/L" />
                <InputField label="PCR ultrasensible (hsCRP)" name="section4.labs.hsCrp" value={formData.section4.labs.hsCrp} onChange={handleInputChange} unit="mg/L" />
                <InputField label="Velocidad de sedimentación globular (VSG)" name="section4.labs.esr" value={formData.section4.labs.esr} onChange={handleInputChange} unit="mm/hora" />
                <RadioGroup label="Factor reumatoide" name="section4.labs.rf" value={formData.section4.labs.rf} onChange={handleInputChange} options={[{label: 'Positivo', value: 'positive'}, {label: 'Negativo', value: 'negative'}, {label: 'No realizado', value: 'not_done'}]} />
                <RadioGroup label="Anticuerpos anti-CCP" name="section4.labs.antiCcp" value={formData.section4.labs.antiCcp} onChange={handleInputChange} options={[{label: 'Positivo', value: 'positive'}, {label: 'Negativo', value: 'negative'}, {label: 'No realizado', value: 'not_done'}]} />
                <RadioGroup label="ANA" name="section4.labs.ana" value={formData.section4.labs.ana} onChange={handleInputChange} options={[{label: 'Positivo', value: 'positive'}, {label: 'Negativo', value: 'negative'}, {label: 'No realizado', value: 'not_done'}]} />
            </SubSection>
            <SubSection title="4.3 Articulaciones afectadas y patrón">
                 <CheckboxGroup
                    label="¿Qué articulaciones están afectadas?"
                    name="section4.joints.affected"
                    values={formData.section4.joints.affected}
                    onChange={handleInputChange}
                    options={[
                        {label: 'Manos/dedos', value: 'hands'}, {label: 'Muñecas', value: 'wrists'},
                        {label: 'Codos', value: 'elbows'}, {label: 'Hombros', value: 'shoulders'},
                        {label: 'Rodillas', value: 'knees'}, {label: 'Tobillos', value: 'ankles'},
                        {label: 'Pies/dedos de los pies', value: 'feet'}, {label: 'Caderas', value: 'hips'},
                        {label: 'Columna vertebral', value: 'spine'}, {label: 'Mandíbula (ATM)', value: 'tmj'},
                    ]}
                    className="md:col-span-2"
                 />
                 <RadioGroup
                    label="Patrón de afectación"
                    name="section4.joints.pattern"
                    value={formData.section4.joints.pattern}
                    onChange={handleInputChange}
                    options={[
                        {label: 'Simétrico', value: 'symmetric'},
                        {label: 'Asimétrico', value: 'asymmetric'},
                        {label: 'Migratorio', value: 'migratory'},
                        {label: 'Poliarticular', value: 'polyarticular'},
                    ]}
                 />
            </SubSection>
             <SubSection title="4.4 Evaluación del dolor y función articular">
                <SliderField label="Dolor en reposo (0-10)" name="section4.pain.rest" value={formData.section4.pain.rest} onChange={handleInputChange} />
                <SliderField label="Dolor con actividad (0-10)" name="section4.pain.activity" value={formData.section4.pain.activity} onChange={handleInputChange} />
                <SliderField label="Dolor nocturno (0-10)" name="section4.pain.night" value={formData.section4.pain.night} onChange={handleInputChange} />
                <RadioGroup label="¿Experimenta rigidez al despertar?" name="section4.pain.morningStiffness" value={formData.section4.pain.morningStiffness} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} />
                {formData.section4.pain.morningStiffness === 'yes' && (
                    <SelectField label="Duración de la rigidez" name="section4.pain.stiffnessDuration" value={formData.section4.pain.stiffnessDuration} onChange={handleInputChange} options={[
                        {label: "< 15 minutos", value: "<15"},
                        {label: "15-30 minutos", value: "15-30"},
                        {label: "30-60 minutos", value: "30-60"},
                        {label: "> 60 minutos", value: ">60"},
                    ]} />
                )}
             </SubSection>
              <div className="p-4 border-l-4 border-gray-200 rounded-r-lg bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cuestionario HAQ-DI (Health Assessment Questionnaire)</h3>
                <p className="text-xs text-gray-500 mb-4">En la última semana, ¿pudo realizar las siguientes actividades? (0 = Sin dificultad, 1 = Con alguna dificultad, 2 = Con mucha dificultad, 3 = Incapaz de hacerlo)</p>
                <div className="space-y-4">
                    {[
                        {name: 'dressing', label: 'Vestirse, incluyendo atar cordones y abrochar botones'},
                        {name: 'arising', label: 'Levantarse de una silla sin brazos'},
                        {name: 'eating', label: 'Llevarse comida a la boca'},
                        {name: 'walking', label: 'Caminar al aire libre en terreno plano'},
                        {name: 'hygiene', label: 'Lavar y secar todo el cuerpo'},
                        {name: 'reaching', label: 'Agacharse para recoger ropa del suelo'},
                        {name: 'gripping', label: 'Abrir un frasco nuevo previamente abierto'},
                        {name: 'errands', label: 'Realizar mandados y compras'},
                    ].map(q => (
                         <RadioGroup key={q.name} label={q.label} name={`section4.haq.${q.name}`} value={formData.section4.haq[q.name as keyof typeof formData.section4.haq]} onChange={handleInputChange} options={["0", "1", "2", "3"].map(v => ({label: v, value: v}))} />
                    ))}
                </div>
                <div className="flex items-center space-x-3 bg-teal-50 p-3 rounded-lg mt-4">
                    <label className="text-sm font-bold text-teal-800">Puntaje HAQ-DI total (promedio):</label>
                    <span className="text-lg font-bold text-teal-600">{haqScore}</span>
                 </div>
              </div>
            <SubSection title="4.5 Impacto en calidad de vida">
                <RadioGroup label="¿El dolor articular interfiere con el cuidado del bebé?" name="section4.qualityOfLife.interferesWithBabyCare" value={formData.section4.qualityOfLife.interferesWithBabyCare} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section4.qualityOfLife.interferesWithBabyCare === 'yes' && (
                    <SliderField label="Califique la interferencia (0-10)" name="section4.qualityOfLife.interferenceScore" value={formData.section4.qualityOfLife.interferenceScore} onChange={handleInputChange} />
                )}
                <RadioGroup label="¿El dolor interfiere con la lactancia?" name="section4.qualityOfLife.interferesWithLactation" value={formData.section4.qualityOfLife.interferesWithLactation} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                {formData.section4.qualityOfLife.interferesWithLactation === 'yes' && (
                    <TextareaField label="Especifique" name="section4.qualityOfLife.lactationInterferenceDetails" value={formData.section4.qualityOfLife.lactationInterferenceDetails} onChange={handleInputChange} />
                )}
            </SubSection>
            <SubSection title="4.6 Tratamiento actual para artritis">
                <div className="md:col-span-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Medicamentos antiinflamatorios actuales</p>
                    <div className="flex items-center gap-4"><CheckboxField label="AINEs" name="section4.treatment.nsaids" checked={formData.section4.treatment.nsaids} onChange={handleInputChange} />{formData.section4.treatment.nsaids && <InputField label=" " name="section4.treatment.nsaidsDesc" value={formData.section4.treatment.nsaidsDesc} onChange={handleInputChange} placeholder="Dosis y Frecuencia"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Paracetamol" name="section4.treatment.paracetamol" checked={formData.section4.treatment.paracetamol} onChange={handleInputChange} />{formData.section4.treatment.paracetamol && <InputField label=" " name="section4.treatment.paracetamolDesc" value={formData.section4.treatment.paracetamolDesc} onChange={handleInputChange} placeholder="Dosis y Frecuencia"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Corticosteroides" name="section4.treatment.corticosteroids" checked={formData.section4.treatment.corticosteroids} onChange={handleInputChange} />{formData.section4.treatment.corticosteroids && <InputField label=" " name="section4.treatment.corticosteroidsDesc" value={formData.section4.treatment.corticosteroidsDesc} onChange={handleInputChange} placeholder="Dosis"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="DMARDs" name="section4.treatment.dmards" checked={formData.section4.treatment.dmards} onChange={handleInputChange} />{formData.section4.treatment.dmards && <InputField label=" " name="section4.treatment.dmardsDesc" value={formData.section4.treatment.dmardsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Medicamentos biológicos" name="section4.treatment.biologics" checked={formData.section4.treatment.biologics} onChange={handleInputChange} />{formData.section4.treatment.biologics && <InputField label=" " name="section4.treatment.biologicsDesc" value={formData.section4.treatment.biologicsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                </div>
                <div className="md:col-span-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Tratamientos no farmacológicos</p>
                    <div className="flex items-center gap-4"><CheckboxField label="Fisioterapia" name="section4.treatment.physiotherapy" checked={formData.section4.treatment.physiotherapy} onChange={handleInputChange} />{formData.section4.treatment.physiotherapy && <InputField label="Frecuencia" name="section4.treatment.physioFreq" value={formData.section4.treatment.physioFreq} onChange={handleInputChange} />}</div>
                    <CheckboxField label="Terapia ocupacional" name="section4.treatment.occupationalTherapy" checked={formData.section4.treatment.occupationalTherapy} onChange={handleInputChange} />
                    <CheckboxField label="Aplicación de calor/frío" name="section4.treatment.heatCold" checked={formData.section4.treatment.heatCold} onChange={handleInputChange} />
                    <CheckboxField label="Acupuntura" name="section4.treatment.acupuncture" checked={formData.section4.treatment.acupuncture} onChange={handleInputChange} />
                    <CheckboxField label="Masaje terapéutico" name="section4.treatment.massage" checked={formData.section4.treatment.massage} onChange={handleInputChange} />
                    <div className="flex items-center gap-4"><CheckboxField label="Otros" name="section4.treatment.otherNonPharma" checked={formData.section4.treatment.otherNonPharma} onChange={handleInputChange} />{formData.section4.treatment.otherNonPharma && <InputField label=" " name="section4.treatment.otherNonPharmaDesc" value={formData.section4.treatment.otherNonPharmaDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                </div>
                <div className="md:col-span-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Suplementos para articulaciones</p>
                    <div className="flex items-center gap-4"><CheckboxField label="Glucosamina" name="section4.treatment.glucosamine" checked={formData.section4.treatment.glucosamine} onChange={handleInputChange} />{formData.section4.treatment.glucosamine && <InputField label="Dosis" name="section4.treatment.glucosamineDosage" value={formData.section4.treatment.glucosamineDosage} onChange={handleInputChange} placeholder="mg/día"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Condroitina" name="section4.treatment.chondroitin" checked={formData.section4.treatment.chondroitin} onChange={handleInputChange} />{formData.section4.treatment.chondroitin && <InputField label="Dosis" name="section4.treatment.chondroitinDosage" value={formData.section4.treatment.chondroitinDosage} onChange={handleInputChange} placeholder="mg/día"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="MSM" name="section4.treatment.msm" checked={formData.section4.treatment.msm} onChange={handleInputChange} />{formData.section4.treatment.msm && <InputField label="Dosis" name="section4.treatment.msmDosage" value={formData.section4.treatment.msmDosage} onChange={handleInputChange} placeholder="mg/día"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Colágeno" name="section4.treatment.collagen" checked={formData.section4.treatment.collagen} onChange={handleInputChange} />{formData.section4.treatment.collagen && <InputField label="Dosis" name="section4.treatment.collagenDosage" value={formData.section4.treatment.collagenDosage} onChange={handleInputChange} placeholder="mg/día"/>}</div>
                    <div className="flex items-center gap-4"><CheckboxField label="Otros" name="section4.treatment.otherSupplements" checked={formData.section4.treatment.otherSupplements} onChange={handleInputChange} />{formData.section4.treatment.otherSupplements && <InputField label=" " name="section4.treatment.otherSupplementsDesc" value={formData.section4.treatment.otherSupplementsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                </div>
            </SubSection>
           </Section>

           {/* Section 5 */}
            <Section title="SECCIÓN 5: LACTANCIA Y ESTADO POSTPARTO">
                <SubSection title="5.1 Información del embarazo y parto">
                    <InputField label="Número de embarazos (gravida)" name="section5.pregnancyHistory.gravida" type="number" value={formData.section5.pregnancyHistory.gravida} onChange={handleInputChange} />
                    <InputField label="Número de partos (para)" name="section5.pregnancyHistory.para" type="number" value={formData.section5.pregnancyHistory.para} onChange={handleInputChange} />
                    <RadioGroup label="Tipo de parto más reciente" name="section5.pregnancyHistory.deliveryType" value={formData.section5.pregnancyHistory.deliveryType} onChange={handleInputChange} options={[{label: 'Vaginal espontáneo', value: 'vaginal'}, {label: 'Vaginal instrumentado', value: 'instrumented'}, {label: 'Cesárea', value: 'cesarean'}]} className="md:col-span-3"/>
                    {formData.section5.pregnancyHistory.deliveryType === 'cesarean' && (
                        <InputField label="Razón de la cesárea" name="section5.pregnancyHistory.cesareanReason" value={formData.section5.pregnancyHistory.cesareanReason} onChange={handleInputChange} className="md:col-span-3" />
                    )}
                    <RadioGroup label="¿Hubo complicaciones durante el parto?" name="section5.pregnancyHistory.complications" value={formData.section5.pregnancyHistory.complications} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section5.pregnancyHistory.complications === 'yes' && (
                        <TextareaField label="Detalles" name="section5.pregnancyHistory.complicationDetails" value={formData.section5.pregnancyHistory.complicationDetails} onChange={handleInputChange} className="md:col-span-2" />
                    )}
                    <RadioGroup label="¿Hubo complicaciones relacionadas con EDS?" name="section5.pregnancyHistory.edsComplications" value={formData.section5.pregnancyHistory.edsComplications} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section5.pregnancyHistory.edsComplications === 'yes' && (
                        <TextareaField label="Detalles" name="section5.pregnancyHistory.edsComplicationDetails" value={formData.section5.pregnancyHistory.edsComplicationDetails} onChange={handleInputChange} className="md:col-span-2" />
                    )}
                </SubSection>
                 <SubSection title="5.2 Estado actual de lactancia">
                    <RadioGroup label="¿Está amamantando actualmente?" name="section5.lactation.currentlyBreastfeeding" value={formData.section5.lactation.currentlyBreastfeeding} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section5.lactation.currentlyBreastfeeding === 'no' && (<>
                        <InputField label="¿Cuándo dejó de amamantar?" name="section5.lactation.stoppedDate" type="date" value={formData.section5.lactation.stoppedDate} onChange={handleInputChange} />
                        <InputField label="Razón" name="section5.lactation.stoppedReason" value={formData.section5.lactation.stoppedReason} onChange={handleInputChange} />
                    </>)}
                    <RadioGroup label="Tipo de lactancia" name="section5.lactation.lactationType" value={formData.section5.lactation.lactationType} onChange={handleInputChange} options={[{label: 'Exclusiva', value: 'exclusive'}, {label: 'Predominante', value: 'predominant'}, {label: 'Mixta', value: 'mixed'}, {label: 'Fórmula', value: 'formula'}]} className="md:col-span-3" />
                    {formData.section5.lactation.lactationType === 'mixed' && (<>
                        <InputField label="% Leche materna" name="section5.lactation.proportionBreastmilk" type="number" value={formData.section5.lactation.proportionBreastmilk} onChange={handleInputChange} />
                        <InputField label="% Fórmula" name="section5.lactation.proportionFormula" type="number" value={formData.section5.lactation.proportionFormula} onChange={handleInputChange} />
                    </>)}
                    <InputField label="Tomas durante el día (24h)" name="section5.lactation.frequencyDay" type="number" value={formData.section5.lactation.frequencyDay} onChange={handleInputChange} />
                    <InputField label="Tomas durante la noche (24h)" name="section5.lactation.frequencyNight" type="number" value={formData.section5.lactation.frequencyNight} onChange={handleInputChange} />
                    <InputField label="Duración promedio de toma" name="section5.lactation.avgDuration" type="number" value={formData.section5.lactation.avgDuration} onChange={handleInputChange} unit="minutos" />
                    <RadioGroup label="¿Extrae leche con bomba?" name="section5.lactation.pumping" value={formData.section5.lactation.pumping} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section5.lactation.pumping === 'yes' && (<>
                        <InputField label="Frecuencia de extracción" name="section5.lactation.pumpFrequency" type="number" value={formData.section5.lactation.pumpFrequency} onChange={handleInputChange} unit="veces/día" />
                        <InputField label="Cantidad extraída por sesión" name="section5.lactation.pumpAmount" type="number" value={formData.section5.lactation.pumpAmount} onChange={handleInputChange} unit="ml" />
                    </>)}
                </SubSection>
                <SubSection title="5.3 Evaluación de producción de leche">
                    <RadioGroup label="¿Está satisfecha con su producción de leche?" name="section5.milkProduction.satisfied" value={formData.section5.milkProduction.satisfied} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    <CheckboxGroup 
                        label="¿Ha experimentado alguna de las siguientes preocupaciones?"
                        name="section5.milkProduction.concerns"
                        values={formData.section5.milkProduction.concerns}
                        onChange={handleInputChange}
                        options={[
                            {label: 'Baja producción de leche', value: 'low'},
                            {label: 'Producción excesiva', value: 'high'},
                            {label: 'Mastitis', value: 'mastitis'},
                            {label: 'Obstrucción de conductos', value: 'clogged'},
                            {label: 'Dolor durante la lactancia', value: 'pain'},
                            {label: 'Problemas de agarre del bebé', value: 'latch'},
                            {label: 'Pezones agrietados/sangrantes', value: 'cracked'},
                        ]}
                        className="md:col-span-2"
                    />
                </SubSection>
                <SubSection title="5.4 Crecimiento del bebé">
                    <InputField label="Peso del bebé al nacer" name="section5.babyGrowth.birthWeight" type="number" value={formData.section5.babyGrowth.birthWeight} onChange={handleInputChange} unit="kg" />
                    <InputField label="Peso actual del bebé" name="section5.babyGrowth.currentWeight" type="number" value={formData.section5.babyGrowth.currentWeight} onChange={handleInputChange} unit="kg" />
                    <InputField label="Fecha peso actual" name="section5.babyGrowth.currentWeightDate" type="date" value={formData.section5.babyGrowth.currentWeightDate} onChange={handleInputChange} />
                    <RadioGroup label="¿El bebé está ganando peso apropiadamente?" name="section5.babyGrowth.gainingWeight" value={formData.section5.babyGrowth.gainingWeight} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    <InputField label="Pañales mojados por día" name="section5.babyGrowth.wetDiapers" type="number" value={formData.section5.babyGrowth.wetDiapers} onChange={handleInputChange} />
                    <InputField label="Deposiciones por día" name="section5.babyGrowth.dirtyDiapers" type="number" value={formData.section5.babyGrowth.dirtyDiapers} onChange={handleInputChange} />
                </SubSection>
                <SubSection title="5.5 Recuperación postparto">
                     <RadioGroup label="¿Ha tenido su primera menstruación postparto?" name="section5.postpartumRecovery.firstMenstruation" value={formData.section5.postpartumRecovery.firstMenstruation} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                     {formData.section5.postpartumRecovery.firstMenstruation === 'yes' && (
                        <InputField label="¿Cuándo?" name="section5.postpartumRecovery.firstMenstruationDate" type="date" value={formData.section5.postpartumRecovery.firstMenstruationDate} onChange={handleInputChange} />
                     )}
                     <RadioGroup 
                        label="¿Cómo describiría su recuperación postparto?"
                        name="section5.postpartumRecovery.recoveryRating"
                        value={formData.section5.postpartumRecovery.recoveryRating}
                        onChange={handleInputChange}
                        options={[
                            {label: 'Excelente', value: 'excellent'},
                            {label: 'Buena', value: 'good'},
                            {label: 'Regular', value: 'fair'},
                            {label: 'Mala', value: 'poor'},
                        ]}
                     />
                    <CheckboxGroup
                        label="¿Ha experimentado alguna complicación postparto?"
                        name="section5.postpartumRecovery.complications"
                        values={formData.section5.postpartumRecovery.complications}
                        onChange={handleInputChange}
                        options={[
                            {label: 'Infección', value: 'infection'},
                            {label: 'Hemorragia postparto', value: 'hemorrhage'},
                            {label: 'Anemia', value: 'anemia'},
                            {label: 'Depresión postparto', value: 'depression'},
                            {label: 'Ansiedad postparto', value: 'anxiety'},
                            {label: 'Diástasis de rectos', value: 'diastasis'},
                            {label: 'Incontinencia urinaria', value: 'incontinence'},
                            {label: 'Dolor pélvico persistente', value: 'pelvic_pain'},
                            {label: 'Ninguna', value: 'none'},
                        ]}
                        className="md:col-span-2"
                    />
                </SubSection>
                <div className="p-4 border-l-4 border-gray-200 rounded-r-lg bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">5.6 Screening de depresión postparto (EPDS)</h3>
                     <div className="space-y-4">
                        <RadioGroup label="1. He sido capaz de reír y ver el lado bueno de las cosas" name="section5.epds.q1" value={formData.section5.epds.q1} onChange={handleInputChange} options={[{label: "Tanto como siempre (0)", value: '0'}, {label: "No tanto ahora (1)", value: '1'}, {label: "Mucho menos (2)", value: '2'}, {label: "No, nada (3)", value: '3'}]} />
                        <RadioGroup label="2. He mirado el futuro con placer" name="section5.epds.q2" value={formData.section5.epds.q2} onChange={handleInputChange} options={[{label: "Tanto como siempre (0)", value: '0'}, {label: "Menos de lo que solía (1)", value: '1'}, {label: "Mucho menos de lo que solía (2)", value: '2'}, {label: "Casi nada (3)", value: '3'}]} />
                        <RadioGroup label="3. Me he culpado sin necesidad cuando las cosas no salían bien" name="section5.epds.q3" value={formData.section5.epds.q3} onChange={handleInputChange} options={[{label: "Sí, la mayoría de las veces (3)", value: '3'}, {label: "Sí, algunas veces (2)", value: '2'}, {label: "No muy a menudo (1)", value: '1'}, {label: "No, nunca (0)", value: '0'}]} />
                        <RadioGroup label="4. He estado ansiosa o preocupada sin motivo" name="section5.epds.q4" value={formData.section5.epds.q4} onChange={handleInputChange} options={[{label: "No, para nada (0)", value: '0'}, {label: "Casi nada (1)", value: '1'}, {label: "Sí, a veces (2)", value: '2'}, {label: "Sí, mucho (3)", value: '3'}]} />
                        <RadioGroup label="5. He sentido miedo o pánico sin motivo alguno" name="section5.epds.q5" value={formData.section5.epds.q5} onChange={handleInputChange} options={[{label: "Sí, bastante (3)", value: '3'}, {label: "Sí, a veces (2)", value: '2'}, {label: "No, no mucho (1)", value: '1'}, {label: "No, nada (0)", value: '0'}]} />
                        <RadioGroup label="6. Las cosas me oprimen o agobian" name="section5.epds.q6" value={formData.section5.epds.q6} onChange={handleInputChange} options={[{label: "Sí, la mayor parte del tiempo (3)", value: '3'}, {label: "Sí, a veces (2)", value: '2'}, {label: "No, casi nunca (1)", value: '1'}, {label: "No, nada (0)", value: '0'}]} />
                        <RadioGroup label="7. Me he sentido tan infeliz que he tenido dificultad para dormir" name="section5.epds.q7" value={formData.section5.epds.q7} onChange={handleInputChange} options={[{label: "Sí, casi siempre (3)", value: '3'}, {label: "Sí, a veces (2)", value: '2'}, {label: "No muy a menudo (1)", value: '1'}, {label: "No, nada (0)", value: '0'}]} />
                        <RadioGroup label="8. Me he sentido triste o desgraciada" name="section5.epds.q8" value={formData.section5.epds.q8} onChange={handleInputChange} options={[{label: "Sí, casi siempre (3)", value: '3'}, {label: "Sí, bastante a menudo (2)", value: '2'}, {label: "No muy a menudo (1)", value: '1'}, {label: "No, nada (0)", value: '0'}]} />
                        <RadioGroup label="9. He estado tan infeliz que he estado llorando" name="section5.epds.q9" value={formData.section5.epds.q9} onChange={handleInputChange} options={[{label: "Sí, casi siempre (3)", value: '3'}, {label: "Sí, bastante a menudo (2)", value: '2'}, {label: "Solo ocasionalmente (1)", value: '1'}, {label: "No, nunca (0)", value: '0'}]} />
                        <RadioGroup label="10. He pensado en hacerme daño a mí misma" name="section5.epds.q10" value={formData.section5.epds.q10} onChange={handleInputChange} options={[{label: "Sí, bastante a menudo (3)", value: '3'}, {label: "A veces (2)", value: '2'}, {label: "Casi nunca (1)", value: '1'}, {label: "Nunca (0)", value: '0'}]} />
                     </div>
                     <div className="flex items-center space-x-3 bg-teal-50 p-3 rounded-lg mt-4">
                        <label className="text-sm font-bold text-teal-800">Puntaje EPDS total:</label>
                        <span className="text-lg font-bold text-teal-600">{epdsScore}</span>
                        {epdsScore >= 13 && <span className="text-sm font-semibold text-red-600">(≥13 sugiere depresión postparto)</span>}
                     </div>
                </div>
            </Section>
            
            {/* Section 6 */}
            <Section title="SECCIÓN 6: HISTORIA DIETÉTICA Y NUTRICIONAL">
              <SubSection title="6.1 Patrón alimentario actual">
                <InputField label="Número de comidas al día" name="section6.dietaryHistory.mealsPerDay" type="number" value={formData.section6.dietaryHistory.mealsPerDay} onChange={handleInputChange} />
                <InputField label="Número de snacks al día" name="section6.dietaryHistory.snacksPerDay" type="number" value={formData.section6.dietaryHistory.snacksPerDay} onChange={handleInputChange} />
                <InputField label="Horario Desayuno" name="section6.dietaryHistory.breakfastTime" type="time" value={formData.section6.dietaryHistory.breakfastTime} onChange={handleInputChange} />
                <InputField label="Horario Almuerzo" name="section6.dietaryHistory.lunchTime" type="time" value={formData.section6.dietaryHistory.lunchTime} onChange={handleInputChange} />
                <InputField label="Horario Cena" name="section6.dietaryHistory.dinnerTime" type="time" value={formData.section6.dietaryHistory.dinnerTime} onChange={handleInputChange} />
                <InputField label="Horarios Snacks" name="section6.dietaryHistory.snackTimes" value={formData.section6.dietaryHistory.snackTimes} onChange={handleInputChange} />
              </SubSection>
              <SubSection title="6.2 Recordatorio de 24 horas (día típico reciente)">
                <TextareaField label="Desayuno" name="section6.recall24h.breakfast" value={formData.section6.recall24h.breakfast} onChange={handleInputChange} placeholder="Describa alimentos y cantidades..."/>
                <TextareaField label="Snack Media Mañana" name="section6.recall24h.morningSnack" value={formData.section6.recall24h.morningSnack} onChange={handleInputChange} />
                <TextareaField label="Almuerzo" name="section6.recall24h.lunch" value={formData.section6.recall24h.lunch} onChange={handleInputChange} />
                <TextareaField label="Snack Tarde" name="section6.recall24h.afternoonSnack" value={formData.section6.recall24h.afternoonSnack} onChange={handleInputChange} />
                <TextareaField label="Cena" name="section6.recall24h.dinner" value={formData.section6.recall24h.dinner} onChange={handleInputChange} />
                <TextareaField label="Snack Nocturno" name="section6.recall24h.eveningSnack" value={formData.section6.recall24h.eveningSnack} onChange={handleInputChange} />
                <InputField label="Agua" name="section6.recall24h.water" value={formData.section6.recall24h.water} onChange={handleInputChange} placeholder="Vasos/litros"/>
                <InputField label="Café" name="section6.recall24h.coffee" value={formData.section6.recall24h.coffee} onChange={handleInputChange} placeholder="Tazas"/>
                <InputField label="Té" name="section6.recall24h.tea" value={formData.section6.recall24h.tea} onChange={handleInputChange} placeholder="Tazas"/>
                <InputField label="Jugos" name="section6.recall24h.juice" value={formData.section6.recall24h.juice} onChange={handleInputChange} placeholder="Vasos"/>
                <InputField label="Refrescos" name="section6.recall24h.soda" value={formData.section6.recall24h.soda} onChange={handleInputChange} placeholder="Vasos"/>
                <InputField label="Otras bebidas" name="section6.recall24h.otherDrinks" value={formData.section6.recall24h.otherDrinks} onChange={handleInputChange} />
              </SubSection>
              <SubSection title="6.3 Frecuencia de consumo de grupos alimentarios">
                 {Object.keys(formData.section6.foodFrequency).map(key => {
                     const foodLabels: { [key: string]: string } = {
                         fish: 'Pescado',
                         seafood: 'Mariscos',
                         poultry: 'Aves de corral',
                         redMeat: 'Carne roja',
                         pork: 'Cerdo',
                         eggs: 'Huevos',
                         legumes: 'Legumbres',
                         tofu: 'Tofu',
                         milk: 'Leche',
                         yogurt: 'Yogur',
                         cheese: 'Queso',
                         whiteBread: 'Pan blanco',
                         wholeBread: 'Pan integral',
                         whiteRice: 'Arroz blanco',
                         brownRice: 'Arroz integral',
                         pasta: 'Pasta',
                         oats: 'Avena',
                         cereals: 'Cereales',
                         freshFruits: 'Frutas frescas',
                         rawVeggies: 'Verduras crudas',
                         cookedVeggies: 'Verduras cocidas',
                         fruitJuices: 'Jugos de fruta',
                         oliveOil: 'Aceite de oliva',
                         otherOils: 'Otros aceites',
                         butter: 'Mantequilla',
                         avocado: 'Aguacate',
                         nuts: 'Frutos secos',
                         fastFood: 'Comida rápida',
                         frozenMeals: 'Comidas congeladas',
                         processedSnacks: 'Snacks procesados',
                         sweets: 'Dulces',
                         sugaryDrinks: 'Bebidas azucaradas'
                     };
                     return (
                         <SelectField
                             key={key}
                             label={foodLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                             name={`section6.foodFrequency.${key}`}
                             value={formData.section6.foodFrequency[key as keyof typeof formData.section6.foodFrequency]}
                             onChange={handleInputChange}
                             options={[
                                 { label: 'Seleccione frecuencia', value: '' },
                                 { label: 'Diario', value: 'daily' },
                                 { label: 'Semanal', value: 'weekly' },
                                 { label: 'Mensual', value: 'monthly' },
                                 { label: 'Raro/Nunca', value: 'rarely' },
                             ]}
                         />
                     );
                 })}
              </SubSection>
              <SubSection title="6.4 Restricciones y preferencias dietéticas">
                <CheckboxGroup
                  label="¿Sigue algún patrón dietético especial?"
                  name="section6.restrictions.patterns"
                  values={formData.section6.restrictions.patterns}
                  onChange={handleInputChange}
                  options={[
                    {label: "Vegetariana", value: "vegetarian"},
                    {label: "Vegana", value: "vegan"},
                    {label: "Pescetariana", value: "pescetarian"},
                    {label: "Sin gluten", value: "gluten_free"},
                    {label: "Sin lácteos", value: "dairy_free"},
                    {label: "Baja en carbohidratos", value: "low_carb"},
                    {label: "Cetogénica", value: "keto"},
                    {label: "Paleo", value: "paleo"},
                    {label: "Ayuno intermitente", value: "intermittent_fasting"},
                    {label: "Ninguna restricción", value: "none"},
                  ]}
                  className="md:col-span-3"
                />
                <RadioGroup label="¿Tiene alergias alimentarias?" name="section6.restrictions.allergies" value={formData.section6.restrictions.allergies} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} />
                {formData.section6.restrictions.allergies === 'yes' && <TextareaField label="Especifique alergias" name="section6.restrictions.allergiesDesc" value={formData.section6.restrictions.allergiesDesc} onChange={handleInputChange}/>}
                <RadioGroup label="¿Tiene intolerancias alimentarias?" name="section6.restrictions.intolerances" value={formData.section6.restrictions.intolerances} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} />
                {formData.section6.restrictions.intolerances === 'yes' && <TextareaField label="Especifique intolerancias" name="section6.restrictions.intolerancesDesc" value={formData.section6.restrictions.intolerancesDesc} onChange={handleInputChange}/>}
                <TextareaField label="Alimentos que evita" name="section6.restrictions.avoidedFoods" value={formData.section6.restrictions.avoidedFoods} onChange={handleInputChange} className="md:col-span-3"/>
              </SubSection>
              <SubSection title="6.5 Síntomas gastrointestinales (Frecuencia 0-4)">
                  <SliderField label="Hinchazón abdominal" name="section6.giSymptoms.bloating" value={parseInt(formData.section6.giSymptoms.bloating)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Gases" name="section6.giSymptoms.gas" value={parseInt(formData.section6.giSymptoms.gas)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Dolor abdominal" name="section6.giSymptoms.abdominalPain" value={parseInt(formData.section6.giSymptoms.abdominalPain)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Estreñimiento" name="section6.giSymptoms.constipation" value={parseInt(formData.section6.giSymptoms.constipation)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Diarrea" name="section6.giSymptoms.diarrhea" value={parseInt(formData.section6.giSymptoms.diarrhea)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Náuseas" name="section6.giSymptoms.nausea" value={parseInt(formData.section6.giSymptoms.nausea)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Reflujo/acidez" name="section6.giSymptoms.heartburn" value={parseInt(formData.section6.giSymptoms.heartburn)} onChange={handleInputChange} max={4}/>
                  <SliderField label="Saciedad temprana" name="section6.giSymptoms.earlySatiety" value={parseInt(formData.section6.giSymptoms.earlySatiety)} onChange={handleInputChange} max={4}/>
                  <RadioGroup label="¿Los síntomas están relacionados con alimentos específicos?" name="section6.giSymptoms.relatedToFood" value={formData.section6.giSymptoms.relatedToFood} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} />
                  {formData.section6.giSymptoms.relatedToFood === 'yes' && <InputField label="¿Cuáles?" name="section6.giSymptoms.relatedFoods" value={formData.section6.giSymptoms.relatedFoods} onChange={handleInputChange}/>}
              </SubSection>
              <SubSection title="6.6 Hidratación">
                  <InputField label="Ingesta aproximada de líquidos al día" name="section6.hydration.fluidIntake" value={formData.section6.hydration.fluidIntake} onChange={handleInputChange} placeholder="Litros o vasos"/>
                  <InputField label="Tipo de líquidos principales" name="section6.hydration.mainFluids" value={formData.section6.hydration.mainFluids} onChange={handleInputChange} placeholder="Agua, té, etc."/>
                  <RadioGroup label="¿Experimenta sed excesiva?" name="section6.hydration.excessiveThirst" value={formData.section6.hydration.excessiveThirst} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} />
                  <RadioGroup label="Color de orina típico" name="section6.hydration.urineColor" value={formData.section6.hydration.urineColor} onChange={handleInputChange} options={[
                      {label: "Amarillo pálido", value: "pale_yellow"},
                      {label: "Amarillo medio", value: "medium_yellow"},
                      {label: "Amarillo oscuro", value: "dark_yellow"},
                      {label: "Muy oscuro/ámbar", value: "amber"},
                  ]} className="md:col-span-2"/>
              </SubSection>
            </Section>

            {/* Section 7 */}
            <Section title="SECCIÓN 7: SUPLEMENTACIÓN ACTUAL">
                <SubSection title="7.1 Vitaminas y minerales">
                    <RadioGroup label="¿Toma actualmente algún suplemento?" name="section7.supplements.takingSupplements" value={formData.section7.supplements.takingSupplements} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]} className="md:col-span-3"/>
                    {formData.section7.supplements.takingSupplements === 'yes' && (
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="flex items-center gap-4"><CheckboxField label="Multivitamínico" name="section7.supplements.multivitamin" checked={formData.section7.supplements.multivitamin} onChange={handleInputChange} />{formData.section7.supplements.multivitamin && <InputField label=" " name="section7.supplements.multivitaminName" value={formData.section7.supplements.multivitaminName} onChange={handleInputChange} placeholder="Marca/nombre"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Vitamina D" name="section7.supplements.vitaminD" checked={formData.section7.supplements.vitaminD} onChange={handleInputChange} />{formData.section7.supplements.vitaminD && <InputField label=" " name="section7.supplements.vitaminDDose" value={formData.section7.supplements.vitaminDDose} onChange={handleInputChange} placeholder="Dosis IU/mcg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Vitamina C" name="section7.supplements.vitaminC" checked={formData.section7.supplements.vitaminC} onChange={handleInputChange} />{formData.section7.supplements.vitaminC && <InputField label=" " name="section7.supplements.vitaminCDose" value={formData.section7.supplements.vitaminCDose} onChange={handleInputChange} placeholder="Dosis mg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Calcio" name="section7.supplements.calcium" checked={formData.section7.supplements.calcium} onChange={handleInputChange} />{formData.section7.supplements.calcium && <InputField label=" " name="section7.supplements.calciumDose" value={formData.section7.supplements.calciumDose} onChange={handleInputChange} placeholder="Dosis mg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Magnesio" name="section7.supplements.magnesium" checked={formData.section7.supplements.magnesium} onChange={handleInputChange} />{formData.section7.supplements.magnesium && <InputField label=" " name="section7.supplements.magnesiumDose" value={formData.section7.supplements.magnesiumDose} onChange={handleInputChange} placeholder="Dosis mg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Hierro" name="section7.supplements.iron" checked={formData.section7.supplements.iron} onChange={handleInputChange} />{formData.section7.supplements.iron && <InputField label=" " name="section7.supplements.ironDose" value={formData.section7.supplements.ironDose} onChange={handleInputChange} placeholder="Dosis mg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Zinc" name="section7.supplements.zinc" checked={formData.section7.supplements.zinc} onChange={handleInputChange} />{formData.section7.supplements.zinc && <InputField label=" " name="section7.supplements.zincDose" value={formData.section7.supplements.zincDose} onChange={handleInputChange} placeholder="Dosis mg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Omega-3" name="section7.supplements.omega3" checked={formData.section7.supplements.omega3} onChange={handleInputChange} />{formData.section7.supplements.omega3 && <InputField label=" " name="section7.supplements.omega3Dose" value={formData.section7.supplements.omega3Dose} onChange={handleInputChange} placeholder="Dosis EPA+DHA"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Vitamina B12" name="section7.supplements.vitaminB12" checked={formData.section7.supplements.vitaminB12} onChange={handleInputChange} />{formData.section7.supplements.vitaminB12 && <InputField label=" " name="section7.supplements.vitaminB12Dose" value={formData.section7.supplements.vitaminB12Dose} onChange={handleInputChange} placeholder="Dosis mcg"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Ácido fólico/folato" name="section7.supplements.folate" checked={formData.section7.supplements.folate} onChange={handleInputChange} />{formData.section7.supplements.folate && <InputField label=" " name="section7.supplements.folateDose" value={formData.section7.supplements.folateDose} onChange={handleInputChange} placeholder="Dosis mcg"/>}</div>
                        </div>
                    )}
                </SubSection>
                 <SubSection title="7.2 Suplementos para condiciones específicas">
                    <div className="md:col-span-3">
                        <p className="text-base font-semibold text-gray-600 mb-3">Para colágeno/tejido conectivo:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                            <div className="flex items-center gap-4"><CheckboxField label="Péptidos de colágeno" name="section7.specificSupplements.collagenPeptides" checked={formData.section7.specificSupplements.collagenPeptides} onChange={handleInputChange} />{formData.section7.specificSupplements.collagenPeptides && <InputField label=" " name="section7.specificSupplements.collagenDose" value={formData.section7.specificSupplements.collagenDose} onChange={handleInputChange} placeholder="Dosis g/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Glicina" name="section7.specificSupplements.glycine" checked={formData.section7.specificSupplements.glycine} onChange={handleInputChange} />{formData.section7.specificSupplements.glycine && <InputField label=" " name="section7.specificSupplements.glycineDose" value={formData.section7.specificSupplements.glycineDose} onChange={handleInputChange} placeholder="Dosis g/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="L-lisina" name="section7.specificSupplements.lysine" checked={formData.section7.specificSupplements.lysine} onChange={handleInputChange} />{formData.section7.specificSupplements.lysine && <InputField label=" " name="section7.specificSupplements.lysineDose" value={formData.section7.specificSupplements.lysineDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="L-prolina" name="section7.specificSupplements.proline" checked={formData.section7.specificSupplements.proline} onChange={handleInputChange} />{formData.section7.specificSupplements.proline && <InputField label=" " name="section7.specificSupplements.prolineDose" value={formData.section7.specificSupplements.prolineDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Vitamina K2" name="section7.specificSupplements.vitaminK2" checked={formData.section7.specificSupplements.vitaminK2} onChange={handleInputChange} />{formData.section7.specificSupplements.vitaminK2 && <InputField label=" " name="section7.specificSupplements.vitaminK2Dose" value={formData.section7.specificSupplements.vitaminK2Dose} onChange={handleInputChange} placeholder="Dosis mcg"/>}</div>
                        </div>
                    </div>
                     <div className="md:col-span-3">
                        <p className="text-base font-semibold text-gray-600 mb-3 mt-4">Para resistencia a insulina/metabolismo:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                            <div className="flex items-center gap-4"><CheckboxField label="Myo-inositol" name="section7.specificSupplements.inositol" checked={formData.section7.specificSupplements.inositol} onChange={handleInputChange} />{formData.section7.specificSupplements.inositol && <InputField label=" " name="section7.specificSupplements.inositolDose" value={formData.section7.specificSupplements.inositolDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Berberina" name="section7.specificSupplements.berberine" checked={formData.section7.specificSupplements.berberine} onChange={handleInputChange} />{formData.section7.specificSupplements.berberine && <InputField label=" " name="section7.specificSupplements.berberineDose" value={formData.section7.specificSupplements.berberineDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Cromo" name="section7.specificSupplements.chromium" checked={formData.section7.specificSupplements.chromium} onChange={handleInputChange} />{formData.section7.specificSupplements.chromium && <InputField label=" " name="section7.specificSupplements.chromiumDose" value={formData.section7.specificSupplements.chromiumDose} onChange={handleInputChange} placeholder="Dosis mcg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Ácido alfa lipoico" name="section7.specificSupplements.ala" checked={formData.section7.specificSupplements.ala} onChange={handleInputChange} />{formData.section7.specificSupplements.ala && <InputField label=" " name="section7.specificSupplements.alaDose" value={formData.section7.specificSupplements.alaDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Canela (extracto)" name="section7.specificSupplements.cinnamon" checked={formData.section7.specificSupplements.cinnamon} onChange={handleInputChange} />{formData.section7.specificSupplements.cinnamon && <InputField label=" " name="section7.specificSupplements.cinnamonDose" value={formData.section7.specificSupplements.cinnamonDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                        </div>
                    </div>
                     <div className="md:col-span-3">
                        <p className="text-base font-semibold text-gray-600 mb-3 mt-4">Para inflamación/artritis:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                            <div className="flex items-center gap-4"><CheckboxField label="Cúrcuma/curcumina" name="section7.specificSupplements.turmeric" checked={formData.section7.specificSupplements.turmeric} onChange={handleInputChange} />{formData.section7.specificSupplements.turmeric && <InputField label=" " name="section7.specificSupplements.turmericDose" value={formData.section7.specificSupplements.turmericDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Boswellia" name="section7.specificSupplements.boswellia" checked={formData.section7.specificSupplements.boswellia} onChange={handleInputChange} />{formData.section7.specificSupplements.boswellia && <InputField label=" " name="section7.specificSupplements.boswelliaDose" value={formData.section7.specificSupplements.boswelliaDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Jengibre" name="section7.specificSupplements.ginger" checked={formData.section7.specificSupplements.ginger} onChange={handleInputChange} />{formData.section7.specificSupplements.ginger && <InputField label=" " name="section7.specificSupplements.gingerDose" value={formData.section7.specificSupplements.gingerDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Quercetina" name="section7.specificSupplements.quercetin" checked={formData.section7.specificSupplements.quercetin} onChange={handleInputChange} />{formData.section7.specificSupplements.quercetin && <InputField label=" " name="section7.specificSupplements.quercetinDose" value={formData.section7.specificSupplements.quercetinDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="MSM" name="section7.specificSupplements.msm" checked={formData.section7.specificSupplements.msm} onChange={handleInputChange} />{formData.section7.specificSupplements.msm && <InputField label=" " name="section7.specificSupplements.msmDose" value={formData.section7.specificSupplements.msmDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Glucosamina" name="section7.specificSupplements.glucosamine" checked={formData.section7.specificSupplements.glucosamine} onChange={handleInputChange} />{formData.section7.specificSupplements.glucosamine && <InputField label=" " name="section7.specificSupplements.glucosamineDose" value={formData.section7.specificSupplements.glucosamineDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                            <div className="flex items-center gap-4"><CheckboxField label="Condroitina" name="section7.specificSupplements.chondroitin" checked={formData.section7.specificSupplements.chondroitin} onChange={handleInputChange} />{formData.section7.specificSupplements.chondroitin && <InputField label=" " name="section7.specificSupplements.chondroitinDose" value={formData.section7.specificSupplements.chondroitinDose} onChange={handleInputChange} placeholder="Dosis mg/día"/>}</div>
                        </div>
                    </div>
                     <div className="md:col-span-3">
                        <p className="text-base font-semibold text-gray-600 mb-3 mt-4">Otros:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                            <div className="flex items-center gap-4"><CheckboxField label="Probióticos" name="section7.specificSupplements.probiotics" checked={formData.section7.specificSupplements.probiotics} onChange={handleInputChange} />{formData.section7.specificSupplements.probiotics && <InputField label=" " name="section7.specificSupplements.probioticsName" value={formData.section7.specificSupplements.probioticsName} onChange={handleInputChange} placeholder="Marca/cepas"/>}</div>
                            <InputField label="Otro suplemento 1" name="section7.specificSupplements.other1Name" value={formData.section7.specificSupplements.other1Name} onChange={handleInputChange} />
                            <InputField label="Dosis/Frec." name="section7.specificSupplements.other1Dose" value={formData.section7.specificSupplements.other1Dose} onChange={handleInputChange} />
                             <InputField label="Otro suplemento 2" name="section7.specificSupplements.other2Name" value={formData.section7.specificSupplements.other2Name} onChange={handleInputChange} />
                            <InputField label="Dosis/Frec." name="section7.specificSupplements.other2Dose" value={formData.section7.specificSupplements.other2Dose} onChange={handleInputChange} />
                        </div>
                    </div>
                 </SubSection>
                 <SubSection title="7.3 Adherencia y tolerancia">
                    <RadioGroup label="¿Toma sus suplementos consistentemente?" name="section7.adherence.consistency" value={formData.section7.adherence.consistency} onChange={handleInputChange} options={[
                        {label: "Sí, todos los días", value: "daily"},
                        {label: "La mayoría de los días (5-6/sem)", value: "mostly"},
                        {label: "Algunos días (3-4/sem)", value: "sometimes"},
                        {label: "Rara vez (1-2/sem)", value: "rarely"},
                        {label: "Casi nunca", value: "never"},
                    ]} className="md:col-span-3"/>
                    <RadioGroup label="¿Ha experimentado efectos secundarios?" name="section7.adherence.sideEffects" value={formData.section7.adherence.sideEffects} onChange={handleInputChange} options={[{label: "Sí", value: "yes"}, {label: "No", value: "no"}]}/>
                    {formData.section7.adherence.sideEffects === 'yes' && <TextareaField label="Especifique efectos secundarios" name="section7.adherence.sideEffectsDesc" value={formData.section7.adherence.sideEffectsDesc} onChange={handleInputChange} className="md:col-span-2"/>}
                    <CheckboxGroup label="¿Qué dificulta tomar los suplementos?" name="section7.adherence.barriers" values={formData.section7.adherence.barriers} onChange={handleInputChange} options={[
                        {label: "Demasiados para tomar", value: "too_many"},
                        {label: "Olvido", value: "forget"},
                        {label: "Náuseas/malestar", value: "nausea"},
                        {label: "Costo", value: "cost"},
                        {label: "Tamaño de píldoras", value: "size"},
                        {label: "No veo beneficios", value: "no_benefit"},
                    ]} className="md:col-span-3"/>
                    <InputField label="Otra barrera" name="section7.adherence.otherBarrier" value={formData.section7.adherence.otherBarrier} onChange={handleInputChange} />
                 </SubSection>
            </Section>

            {/* Section 8 */}
            <Section title="SECCIÓN 8: MEDICAMENTOS Y OTROS TRATAMIENTOS">
                <div className="md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">8.1 Medicamentos actuales</h3>
                    <div className="space-y-4">
                        {formData.section8.medications.map((med, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50/50 relative">
                                <InputField label="Medicamento" name={`section8.medications.${index}.name`} value={med.name} onChange={(e) => handleMedicationChange(index, e as React.ChangeEvent<HTMLInputElement>)} />
                                <InputField label="Dosis" name={`section8.medications.${index}.dose`} value={med.dose} onChange={(e) => handleMedicationChange(index, e as React.ChangeEvent<HTMLInputElement>)} />
                                <InputField label="Frecuencia" name={`section8.medications.${index}.freq`} value={med.freq} onChange={(e) => handleMedicationChange(index, e as React.ChangeEvent<HTMLInputElement>)} />
                                <InputField label="Razón" name={`section8.medications.${index}.reason`} value={med.reason} onChange={(e) => handleMedicationChange(index, e as React.ChangeEvent<HTMLInputElement>)} />
                                <InputField label="Desde cuándo" name={`section8.medications.${index}.since`} value={med.since} onChange={(e) => handleMedicationChange(index, e as React.ChangeEvent<HTMLInputElement>)} />
                                {formData.section8.medications.length > 1 && (
                                    <button type="button" onClick={() => removeMedicationRow(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold">&times;</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addMedicationRow} className="mt-4 px-4 py-2 bg-teal-100 text-teal-800 font-semibold rounded-md hover:bg-teal-200 transition">
                        + Agregar Medicamento
                    </button>
                </div>
                 <SubSection title="8.2 Medicamentos específicos">
                    <div className="md:col-span-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Analgésicos/antiinflamatorios (OTC)</p>
                        <div className="flex items-center gap-4"><CheckboxField label="Ibuprofeno" name="section8.otcPainkillers.ibuprofen" checked={formData.section8.otcPainkillers.ibuprofen} onChange={handleInputChange} />{formData.section8.otcPainkillers.ibuprofen && <InputField label="Dosis/Frec." name="section8.otcPainkillers.ibuprofenDose" value={formData.section8.otcPainkillers.ibuprofenDose} onChange={handleInputChange}/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Naproxeno" name="section8.otcPainkillers.naproxen" checked={formData.section8.otcPainkillers.naproxen} onChange={handleInputChange} />{formData.section8.otcPainkillers.naproxen && <InputField label="Dosis/Frec." name="section8.otcPainkillers.naproxenDose" value={formData.section8.otcPainkillers.naproxenDose} onChange={handleInputChange}/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Paracetamol" name="section8.otcPainkillers.paracetamol" checked={formData.section8.otcPainkillers.paracetamol} onChange={handleInputChange} />{formData.section8.otcPainkillers.paracetamol && <InputField label="Dosis/Frec." name="section8.otcPainkillers.paracetamolDose" value={formData.section8.otcPainkillers.paracetamolDose} onChange={handleInputChange}/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Aspirina" name="section8.otcPainkillers.aspirin" checked={formData.section8.otcPainkillers.aspirin} onChange={handleInputChange} />{formData.section8.otcPainkillers.aspirin && <InputField label="Dosis/Frec." name="section8.otcPainkillers.aspirinDose" value={formData.section8.otcPainkillers.aspirinDose} onChange={handleInputChange}/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Otro" name="section8.otcPainkillers.other" checked={formData.section8.otcPainkillers.other} onChange={handleInputChange} />{formData.section8.otcPainkillers.other && <InputField label=" " name="section8.otcPainkillers.otherDesc" value={formData.section8.otcPainkillers.otherDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                    </div>
                    <RadioGroup label="¿Con qué frecuencia toma analgésicos?" name="section8.otcPainkillers.frequency" value={formData.section8.otcPainkillers.frequency} onChange={handleInputChange} options={[{label: 'Diariamente', value: 'daily'}, {label: 'Varias veces/semana', value: 'multi_weekly'}, {label: 'Semanalmente', value: 'weekly'}, {label: 'Ocasionalmente', value: 'occasionally'}, {label: 'Rara vez', value: 'rarely'}]} className="md:col-span-2"/>
                    <div className="md:col-span-3 space-y-2">
                        <RadioGroup label="Anticoncepción" name="section8.contraception.method" value={formData.section8.contraception.method} onChange={handleInputChange} options={[{label: 'No utiliza', value: 'none'}, {label: 'DIU hormonal', value: 'diu_h'}, {label: 'DIU de cobre', value: 'diu_c'}, {label: 'Píldora', value: 'pill'}, {label: 'Inyección', value: 'injection'}, {label: 'Implante', value: 'implant'}, {label: 'Barrera', value: 'barrier'}, {label: 'MAL', value: 'lam'}, {label: 'Otro', value: 'other'}]} />
                        {formData.section8.contraception.method === 'other' && <InputField label=" " name="section8.contraception.otherDesc" value={formData.section8.contraception.otherDesc} onChange={handleInputChange} placeholder="Especifique"/>}
                    </div>
                     <div className="md:col-span-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Medicamentos para salud mental</p>
                        <div className="flex items-center gap-4"><CheckboxField label="Antidepresivos" name="section8.mentalHealthMeds.antidepressants" checked={formData.section8.mentalHealthMeds.antidepressants} onChange={handleInputChange} />{formData.section8.mentalHealthMeds.antidepressants && <InputField label=" " name="section8.mentalHealthMds.antidepressantsDesc" value={formData.section8.mentalHealthMeds.antidepressantsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Ansiolíticos" name="section8.mentalHealthMeds.anxiolytics" checked={formData.section8.mentalHealthMeds.anxiolytics} onChange={handleInputChange} />{formData.section8.mentalHealthMeds.anxiolytics && <InputField label=" " name="section8.mentalHealthMeds.anxiolyticsDesc" value={formData.section8.mentalHealthMeds.anxiolyticsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                        <div className="flex items-center gap-4"><CheckboxField label="Otro" name="section8.mentalHealthMeds.other" checked={formData.section8.mentalHealthMeds.other} onChange={handleInputChange} />{formData.section8.mentalHealthMeds.other && <InputField label=" " name="section8.mentalHealthMeds.otherDesc" value={formData.section8.mentalHealthMeds.otherDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                    </div>
                </SubSection>
                <SubSection title="8.3 Alergias e intolerancias a medicamentos">
                    <RadioGroup label="¿Es alérgica a algún medicamento?" name="section8.allergies.hasAllergies" value={formData.section8.allergies.hasAllergies} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    {formData.section8.allergies.hasAllergies === 'yes' && (
                        <TextareaField label="Especifique medicamento y reacción" name="section8.allergies.allergiesDesc" value={formData.section8.allergies.allergiesDesc} onChange={handleInputChange} className="md:col-span-2" />
                    )}
                </SubSection>
            </Section>

            {/* Section 9 */}
            <Section title="SECCIÓN 9: HISTORIAL FAMILIAR">
                <SubSection title="9.1 Condiciones heredables">
                    {[
                        { name: 't2d', label: 'Diabetes tipo 2' },
                        { name: 'cardiovascular', label: 'Enfermedades cardiovasculares' },
                        { name: 'hypertension', label: 'Hipertensión' },
                        { name: 'eds', label: 'Síndrome de Ehlers-Danlos' },
                        { name: 'hypermobility', label: 'Hiperlaxitud/hipermovilidad articular' },
                        { name: 'ra', label: 'Artritis reumatoide' },
                        { name: 'oa', label: 'Osteoartritis' },
                        { name: 'autoimmune', label: 'Enfermedades autoinmunes' },
                        { name: 'obesity', label: 'Obesidad' },
                        { name: 'pcos', label: 'Síndrome de ovario poliquístico (SOP)' },
                        { name: 'thyroid', label: 'Trastornos de tiroides' },
                        { name: 'celiac', label: 'Enfermedad celíaca' },
                    ].map(condition => (
                        <div key={condition.name} className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4">
                            <RadioGroup
                                label={condition.label}
                                name={`section9.familyHistory.${condition.name}`}
                                value={formData.section9.familyHistory[condition.name as keyof typeof formData.section9.familyHistory] as string}
                                onChange={handleInputChange}
                                options={[{ label: 'Sí', value: 'yes' }, { label: 'No', value: 'no' }]}
                            />
                            {formData.section9.familyHistory[condition.name as keyof typeof formData.section9.familyHistory] === 'yes' && (
                                <InputField
                                    label="Quién / Especifique"
                                    name={`section9.familyHistory.${condition.name}${condition.name === 'autoimmune' ? 'Desc' : 'Who'}`}
                                    value={formData.section9.familyHistory[`${condition.name}${condition.name === 'autoimmune' ? 'Desc' : 'Who'}` as keyof typeof formData.section9.familyHistory] as string}
                                    onChange={handleInputChange}
                                    className="md:col-span-2"
                                />
                            )}
                        </div>
                    ))}
                </SubSection>
            </Section>

            {/* Section 10 */}
            <Section title="SECCIÓN 10: EVALUACIÓN DE SÍNTOMAS ACTUALES">
              <SubSection title="10.1 Síntomas generales (última semana, 0-10)">
                <SliderField label="Fatiga general" name="section10.generalSymptoms.fatigue" value={formData.section10.generalSymptoms.fatigue} onChange={handleInputChange}/>
                <SliderField label="Falta de energía matutina" name="section10.generalSymptoms.morningEnergy" value={formData.section10.generalSymptoms.morningEnergy} onChange={handleInputChange}/>
                <SliderField label="Caída de energía después de comer" name="section10.generalSymptoms.postMealEnergyDip" value={formData.section10.generalSymptoms.postMealEnergyDip} onChange={handleInputChange}/>
                <SliderField label="Fatiga que interfiere con actividades" name="section10.generalSymptoms.fatigueInterference" value={formData.section10.generalSymptoms.fatigueInterference} onChange={handleInputChange}/>
                <SliderField label="Dificultad para conciliar el sueño" name="section10.generalSymptoms.sleepDifficulty" value={formData.section10.generalSymptoms.sleepDifficulty} onChange={handleInputChange}/>
                <SliderField label="Despertares nocturnos" name="section10.generalSymptoms.nightWaking" value={formData.section10.generalSymptoms.nightWaking} onChange={handleInputChange}/>
                <SliderField label="Sueño no reparador" name="section10.generalSymptoms.unrefreshingSleep" value={formData.section10.generalSymptoms.unrefreshingSleep} onChange={handleInputChange}/>
                <SliderField label="Tristeza o depresión" name="section10.generalSymptoms.sadness" value={formData.section10.generalSymptoms.sadness} onChange={handleInputChange}/>
                <SliderField label="Ansiedad o nerviosismo" name="section10.generalSymptoms.anxiety" value={formData.section10.generalSymptoms.anxiety} onChange={handleInputChange}/>
                <SliderField label="Irritabilidad" name="section10.generalSymptoms.irritability" value={formData.section10.generalSymptoms.irritability} onChange={handleInputChange}/>
                <SliderField label="Apatía/falta de interés" name="section10.generalSymptoms.apathy" value={formData.section10.generalSymptoms.apathy} onChange={handleInputChange}/>
                <SliderField label="Dificultad de concentración" name="section10.generalSymptoms.concentrationDifficulty" value={formData.section10.generalSymptoms.concentrationDifficulty} onChange={handleInputChange}/>
                <SliderField label="Memoria deficiente" name="section10.generalSymptoms.poorMemory" value={formData.section10.generalSymptoms.poorMemory} onChange={handleInputChange}/>
                <SliderField label='"Neblina mental"' name="section10.generalSymptoms.brainFog" value={formData.section10.generalSymptoms.brainFog} onChange={handleInputChange}/>
                <SliderField label="Antojos de dulces/carbohidratos" name="section10.generalSymptoms.sweetCravings" value={formData.section10.generalSymptoms.sweetCravings} onChange={handleInputChange}/>
                <SliderField label="Hambre excesiva" name="section10.generalSymptoms.excessiveHunger" value={formData.section10.generalSymptoms.excessiveHunger} onChange={handleInputChange}/>
                <SliderField label="Falta de apetito" name="section10.generalSymptoms.poorAppetite" value={formData.section10.generalSymptoms.poorAppetite} onChange={handleInputChange}/>
              </SubSection>
              <SubSection title="10.2 Síntomas específicos relacionados con condiciones">
                <div className="md:col-span-3">
                  <p className="text-base font-semibold text-gray-600 mb-3">Síntomas de hipoglucemia reactiva</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                      <SelectField label="Temblores" name="section10.specificSymptoms.hypoTremors" value={formData.section10.specificSymptoms.hypoTremors} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Sudoración" name="section10.specificSymptoms.hypoSweating" value={formData.section10.specificSymptoms.hypoSweating} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Mareo" name="section10.specificSymptoms.hypoDizziness" value={formData.section10.specificSymptoms.hypoDizziness} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Confusión" name="section10.specificSymptoms.hypoConfusion" value={formData.section10.specificSymptoms.hypoConfusion} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Hambre intensa" name="section10.specificSymptoms.hypoHunger" value={formData.section10.specificSymptoms.hypoHunger} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Irritabilidad" name="section10.specificSymptoms.hypoIrritability" value={formData.section10.specificSymptoms.hypoIrritability} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <p className="text-base font-semibold text-gray-600 mb-3 mt-4">Síntomas cutáneos (EDS)</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                      <SliderField label="Facilidad de moretones (0-10)" name="section10.specificSymptoms.easyBruising" value={formData.section10.specificSymptoms.easyBruising} onChange={handleInputChange}/>
                      <SliderField label="Piel frágil/desgarros (0-10)" name="section10.specificSymptoms.fragileSkin" value={formData.section10.specificSymptoms.fragileSkin} onChange={handleInputChange}/>
                      <SliderField label="Cicatrización lenta (0-10)" name="section10.specificSymptoms.slowHealing" value={formData.section10.specificSymptoms.slowHealing} onChange={handleInputChange}/>
                      <RadioGroup label="Estrías sin causa aparente" name="section10.specificSymptoms.unexplainedStretchMarks" value={formData.section10.specificSymptoms.unexplainedStretchMarks} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                   </div>
                </div>
                <div className="md:col-span-3">
                  <p className="text-base font-semibold text-gray-600 mb-3 mt-4">Síntomas de disautonomía</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
                      <SelectField label="Mareo al ponerse de pie" name="section10.specificSymptoms.dizzyOnStanding" value={formData.section10.specificSymptoms.dizzyOnStanding} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Palpitaciones" name="section10.specificSymptoms.palpitations" value={formData.section10.specificSymptoms.palpitations} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Intolerancia al calor" name="section10.specificSymptoms.heatIntolerance" value={formData.section10.specificSymptoms.heatIntolerance} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                      <SelectField label="Problemas de regulación de temperatura" name="section10.specificSymptoms.tempRegulation" value={formData.section10.specificSymptoms.tempRegulation} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Raro', value: 'rare'}, {label: 'Frecuente', value: 'frequent'}]} />
                  </div>
                </div>
              </SubSection>
              <SubSection title="10.3 Síntomas que han empeorado desde el parto">
                  <CheckboxGroup
                      label="¿Alguno de los siguientes ha empeorado desde el parto?"
                      name="section10.postpartumChanges"
                      values={formData.section10.postpartumChanges}
                      onChange={handleInputChange}
                      options={[
                          { label: 'Dolor articular', value: 'joint_pain' },
                          { label: 'Fatiga', value: 'fatigue' },
                          { label: 'Inestabilidad articular', value: 'joint_instability' },
                          { label: 'Problemas cutáneos', value: 'skin_issues' },
                          { label: 'Síntomas gastrointestinales', value: 'gi_symptoms' },
                          { label: 'Ansiedad/depresión', value: 'anxiety_depression' },
                          { label: 'Dificultad de concentración', value: 'concentration' },
                          { label: 'Ninguno', value: 'none' },
                      ]}
                      className="md:col-span-3"
                  />
              </SubSection>
            </Section>

            {/* Section 11 */}
            <Section title="SECCIÓN 11: ESTILO DE VIDA Y FACTORES AMBIENTALES">
                <SubSection title="11.1 Actividad física">
                    <InputField label="Tipo de ejercicio (Antes del embarazo)" name="section11.physicalActivity.prePregnancyType" value={formData.section11.physicalActivity.prePregnancyType} onChange={handleInputChange} />
                    <InputField label="Frecuencia (Antes)" name="section11.physicalActivity.prePregnancyFreq" value={formData.section11.physicalActivity.prePregnancyFreq} onChange={handleInputChange} placeholder="veces/semana" />
                    <InputField label="Duración (Antes)" name="section11.physicalActivity.prePregnancyDuration" value={formData.section11.physicalActivity.prePregnancyDuration} onChange={handleInputChange} placeholder="min/sesión" />
                    <RadioGroup label="Intensidad (Antes)" name="section11.physicalActivity.prePregnancyIntensity" value={formData.section11.physicalActivity.prePregnancyIntensity} onChange={handleInputChange} options={[{label: 'Ligera', value: 'light'}, {label: 'Moderada', value: 'moderate'}, {label: 'Intensa', value: 'intense'}]} />
                    <RadioGroup label="¿Ha reanudado actividad física?" name="section11.physicalActivity.currentActivity" value={formData.section11.physicalActivity.currentActivity} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} className="md:col-span-3" />
                    {formData.section11.physicalActivity.currentActivity === 'yes' && (<>
                        <InputField label="Tipo de ejercicio (Actual)" name="section11.physicalActivity.currentType" value={formData.section11.physicalActivity.currentType} onChange={handleInputChange} />
                        <InputField label="Frecuencia (Actual)" name="section11.physicalActivity.currentFreq" value={formData.section11.physicalActivity.currentFreq} onChange={handleInputChange} placeholder="veces/semana" />
                        <InputField label="Duración (Actual)" name="section11.physicalActivity.currentDuration" value={formData.section11.physicalActivity.currentDuration} onChange={handleInputChange} placeholder="min/sesión" />
                    </>)}
                    <RadioGroup label="¿El dolor limita su actividad física?" name="section11.physicalActivity.painLimitsActivity" value={formData.section11.physicalActivity.painLimitsActivity} onChange={handleInputChange} options={[{label: 'Sí', value: 'yes'}, {label: 'No', value: 'no'}]} />
                    <InputField label="Horas de pie al día" name="section11.dailyLife.standingHours" type="number" value={formData.section11.dailyLife.standingHours} onChange={handleInputChange} />
                    <InputField label="Horas sentada al día" name="section11.dailyLife.sittingHours" type="number" value={formData.section11.dailyLife.sittingHours} onChange={handleInputChange} />
                    <InputField label="Horas acostada (sin dormir)" name="section11.dailyLife.lyingHours" type="number" value={formData.section11.dailyLife.lyingHours} onChange={handleInputChange} />
                </SubSection>
                <SubSection title="11.2 Manejo del estrés">
                    <SliderField label="Nivel de estrés general (0-10)" name="section11.stress.level" value={formData.section11.stress.level} onChange={handleInputChange} className="md:col-span-3" />
                    <CheckboxGroup label="Principales fuentes de estrés" name="section11.stress.sources" values={formData.section11.stress.sources} onChange={handleInputChange} options={[{label: 'Cuidado del bebé', value: 'baby_care'}, {label: 'Falta de sueño', value: 'sleep'}, {label: 'Dolor crónico', value: 'pain'}, {label: 'Finanzas', value: 'finance'}, {label: 'Relaciones', value: 'relations'}, {label: 'Trabajo', value: 'work'}, {label: 'Salud', value: 'health'}, {label: 'Falta de apoyo', value: 'support'}]} className="md:col-span-3" />
                    <InputField label="Otra fuente de estrés" name="section11.stress.otherSource" value={formData.section11.stress.otherSource} onChange={handleInputChange} />
                    <CheckboxGroup label="Estrategias de manejo del estrés" name="section11.stress.management" values={formData.section11.stress.management} onChange={handleInputChange} options={[{label: 'Meditación', value: 'meditation'}, {label: 'Yoga', value: 'yoga'}, {label: 'Ejercicio', value: 'exercise'}, {label: 'Terapia', value: 'therapy'}, {label: 'Tiempo para sí misma', value: 'me_time'}, {label: 'Apoyo social', value: 'social'}, {label: 'Respiración profunda', value: 'breathing'}, {label: 'Ninguna', value: 'none'}]} className="md:col-span-3" />
                    <InputField label="Otra estrategia" name="section11.stress.otherManagement" value={formData.section11.stress.otherManagement} onChange={handleInputChange} />
                </SubSection>
                 <SubSection title="11.3 Exposiciones ambientales">
                    <CheckboxField label="Humo de tabaco (activo o pasivo)" name="section11.environment.tobacco" checked={formData.section11.environment.tobacco} onChange={handleInputChange} className="md:col-span-3" />
                    <RadioGroup label="Consumo de alcohol" name="section11.environment.alcohol" value={formData.section11.environment.alcohol} onChange={handleInputChange} options={[{label: 'Nunca', value: 'never'}, {label: 'Ocasional', value: 'occasional'}, {label: 'Semanal', value: 'weekly'}, {label: 'Diario', value: 'daily'}]} />
                    <InputField label="Cantidad" name="section11.environment.alcoholAmount" value={formData.section11.environment.alcoholAmount} onChange={handleInputChange} />
                    <div className="flex items-center gap-4 md:col-span-3"><CheckboxField label="Toxinas ocupacionales/ambientales" name="section11.environment.toxins" checked={formData.section11.environment.toxins} onChange={handleInputChange} />{formData.section11.environment.toxins && <InputField label=" " name="section11.environment.toxinsDesc" value={formData.section11.environment.toxinsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                    <CheckboxField label="Moho en el hogar" name="section11.environment.mold" checked={formData.section11.environment.mold} onChange={handleInputChange} className="md:col-span-3" />
                    <div className="flex items-center gap-4 md:col-span-3"><CheckboxField label="Mascotas" name="section11.environment.pets" checked={formData.section11.environment.pets} onChange={handleInputChange} />{formData.section11.environment.pets && <InputField label=" " name="section11.environment.petsDesc" value={formData.section11.environment.petsDesc} onChange={handleInputChange} placeholder="Especifique"/>}</div>
                </SubSection>
                <SubSection title="11.4 Soporte social">
                    <CheckboxGroup label="¿Vive con?" name="section11.socialSupport.livesWith" values={formData.section11.socialSupport.livesWith} onChange={handleInputChange} options={[{label: 'Pareja/esposo', value: 'partner'}, {label: 'Familia extendida', value: 'family'}, {label: 'Sola con el bebé', value: 'alone'}, {label: 'Otros adultos', value: 'others'}]} className="md:col-span-3" />
                    <InputField label="Otros adultos" name="section11.socialSupport.otherLivesWith" value={formData.section11.socialSupport.otherLivesWith} onChange={handleInputChange} />
                    <SliderField label="Soporte emocional (0-10)" name="section11.socialSupport.emotionalSupport" value={formData.section11.socialSupport.emotionalSupport} onChange={handleInputChange} />
                    <SliderField label="Soporte práctico (ayuda) (0-10)" name="section11.socialSupport.practicalSupport" value={formData.section11.socialSupport.practicalSupport} onChange={handleInputChange} />
                    <SliderField label="Nivel de aislamiento social (0-10)" name="section11.socialSupport.isolationLevel" value={formData.section11.socialSupport.isolationLevel} onChange={handleInputChange} />
                </SubSection>
            </Section>

            {/* Section 12 */}
            <Section title="SECCIÓN 12: OBJETIVOS Y EXPECTATIVAS">
                <SubSection title="12.1 Principales preocupaciones de salud">
                    <InputField label="1. Preocupación Principal" name="section12.goals.concern1" value={formData.section12.goals.concern1} onChange={handleInputChange} className="md:col-span-3"/>
                    <InputField label="2. Segunda Preocupación" name="section12.goals.concern2" value={formData.section12.goals.concern2} onChange={handleInputChange} className="md:col-span-3"/>
                    <InputField label="3. Tercera Preocupación" name="section12.goals.concern3" value={formData.section12.goals.concern3} onChange={handleInputChange} className="md:col-span-3"/>
                </SubSection>
                <SubSection title="12.2 Objetivos del tratamiento nutricional">
                    <CheckboxGroup label="¿Qué espera lograr?" name="section12.goals.nutritionGoals" values={formData.section12.goals.nutritionGoals} onChange={handleInputChange} options={[{label:'Reducir dolor', value:'pain'}, {label:'Mejorar energía', value:'energy'}, {label:'Control glucosa', value:'glucose'}, {label:'Mejorar lactancia', value:'lactation'}, {label:'Mejorar piel', value:'skin'}, {label:'Reducir inflamación', value:'inflammation'}, {label:'Perder peso', value:'weight_loss'}, {label:'Mejorar ánimo', value:'mood'}, {label:'Mejorar digestión', value:'digestion'}, {label:'Prevenir complicaciones', value:'prevention'}, {label:'Reducir medicamentos', value:'meds'}]} className="md:col-span-3"/>
                    <InputField label="Otro objetivo" name="section12.goals.otherGoal" value={formData.section12.goals.otherGoal} onChange={handleInputChange} />
                </SubSection>
                <SubSection title="12.3 Barreras anticipadas">
                    <CheckboxGroup label="¿Qué podría dificultar seguir el plan?" name="section12.barriers.anticipated" values={formData.section12.barriers.anticipated} onChange={handleInputChange} options={[{label:'Falta de tiempo', value:'time'}, {label:'Costo', value:'cost'}, {label:'Cambio de hábitos', value:'habits'}, {label:'Falta de apoyo', value:'support'}, {label:'Antojos', value:'cravings'}, {label:'Fatiga', value:'fatigue'}, {label:'Dolor', value:'pain'}, {label:'Falta de conocimiento', value:'knowledge'}, {label:'Desorganización', value:'disorganization'}]} className="md:col-span-3"/>
                    <InputField label="Otra barrera" name="section12.barriers.otherBarrier" value={formData.section12.barriers.otherBarrier} onChange={handleInputChange} />
                </SubSection>
                <SubSection title="12.4 Recursos y preparación">
                    <RadioGroup label="¿Quién prepara las comidas?" name="section12.resources.preparesMeals" value={formData.section12.resources.preparesMeals} onChange={handleInputChange} options={[{label:'Yo misma', value:'self'}, {label:'Pareja', value:'partner'}, {label:'Compartido', value:'shared'}, {label:'Otro familiar', value:'family'}, {label:'Comida preparada', value:'prepared'}]} />
                    <CheckboxGroup label="¿Tiene acceso a?" name="section12.resources.hasAccessTo" values={formData.section12.resources.hasAccessTo} onChange={handleInputChange} options={[{label:'Cocina completa', value:'kitchen'}, {label:'Refrigerador/congelador', value:'fridge'}, {label:'Horno/estufa', value:'oven'}, {label:'Microondas', value:'microwave'}, {label:'Licuadora', value:'blender'}, {label:'Supermercado', value:'supermarket'}, {label:'Tienda natural', value:'health_store'}, {label:'Delivery', value:'delivery'}]} className="md:col-span-2"/>
                    <RadioGroup label="Tiempo para preparación de comidas" name="section12.resources.timeForPrep" value={formData.section12.resources.timeForPrep} onChange={handleInputChange} options={[{label:'< 30 min/día', value:'<30'}, {label:'30-60 min/día', value:'30-60'}, {label:'1-2 horas/día', value:'1-2h'}, {label:'> 2 horas/día', value:'>2h'}]} className="md:col-span-3"/>
                </SubSection>
                 <SubSection title="12.5 Nivel de motivación">
                    <SliderField label="Motivación para cambios en alimentación (0-10)" name="section12.motivation.foodChanges" value={formData.section12.motivation.foodChanges} onChange={handleInputChange} className="md:col-span-3"/>
                    <SliderField label="Motivación para tomar suplementos (0-10)" name="section12.motivation.supplementChanges" value={formData.section12.motivation.supplementChanges} onChange={handleInputChange} className="md:col-span-3"/>
                    <CheckboxGroup label="¿Qué le motivaría más?" name="section12.motivation.motivators" values={formData.section12.motivation.motivators} onChange={handleInputChange} options={[{label:'Reducción del dolor', value:'pain'}, {label:'Más energía', value:'energy'}, {label:'Salud a largo plazo', value:'health'}, {label:'Ejemplo para mi hijo', value:'example'}, {label:'Evitar medicamentos', value:'meds'}, {label:'Resultados de labs', value:'labs'}, {label:'Sentirme mejor', value:'feel_better'}, {label:'Apoyo médico', value:'support'}]} className="md:col-span-3"/>
                    <InputField label="Otro motivador" name="section12.motivation.otherMotivator" value={formData.section12.motivation.otherMotivator} onChange={handleInputChange} />
                 </SubSection>
            </Section>

            {/* Section 13 */}
            <Section title="SECCIÓN 13: EVALUACIÓN DE LABORATORIOS ADICIONALES">
                <SubSection title="13.1 Laboratorios de micronutrientes (si disponibles)">
                    <InputField label="Fecha" name="section13.micronutrients.date" type="date" value={formData.section13.micronutrients.date} onChange={handleInputChange} />
                    <InputField label="Vitamina D, 25-OH" name="section13.micronutrients.vitD" value={formData.section13.micronutrients.vitD} onChange={handleInputChange} unit="ng/mL"/>
                    <InputField label="Vitamina B12" name="section13.micronutrients.vitB12" value={formData.section13.micronutrients.vitB12} onChange={handleInputChange} unit="pg/mL"/>
                    <InputField label="Folato sérico" name="section13.micronutrients.folate" value={formData.section13.micronutrients.folate} onChange={handleInputChange} unit="ng/mL"/>
                    <InputField label="Ferritina" name="section13.micronutrients.ferritin" value={formData.section13.micronutrients.ferritin} onChange={handleInputChange} unit="ng/mL"/>
                    <InputField label="Hierro sérico" name="section13.micronutrients.serumIron" value={formData.section13.micronutrients.serumIron} onChange={handleInputChange} unit="μg/dL"/>
                    <InputField label="Saturación de transferrina" name="section13.micronutrients.transferrinSat" value={formData.section13.micronutrients.transferrinSat} onChange={handleInputChange} unit="%"/>
                    <InputField label="TIBC" name="section13.micronutrients.tibc" value={formData.section13.micronutrients.tibc} onChange={handleInputChange} unit="μg/dL"/>
                    <InputField label="Magnesio RBC" name="section13.micronutrients.rbcMagnesium" value={formData.section13.micronutrients.rbcMagnesium} onChange={handleInputChange} unit="mg/dL"/>
                    <InputField label="Zinc sérico" name="section13.micronutrients.serumZinc" value={formData.section13.micronutrients.serumZinc} onChange={handleInputChange} unit="μg/dL"/>
                </SubSection>
                <SubSection title="13.2 Perfil tiroideo">
                    <InputField label="Fecha" name="section13.thyroid.date" type="date" value={formData.section13.thyroid.date} onChange={handleInputChange} />
                    <InputField label="TSH" name="section13.thyroid.tsh" value={formData.section13.thyroid.tsh} onChange={handleInputChange} unit="μIU/mL"/>
                    <InputField label="T4 libre" name="section13.thyroid.freeT4" value={formData.section13.thyroid.freeT4} onChange={handleInputChange} unit="ng/dL"/>
                    <InputField label="T3 libre" name="section13.thyroid.freeT3" value={formData.section13.thyroid.freeT3} onChange={handleInputChange} unit="pg/mL"/>
                    <InputField label="Anticuerpos anti-TPO" name="section13.thyroid.tpoAb" value={formData.section13.thyroid.tpoAb} onChange={handleInputChange} unit="IU/mL"/>
                    <InputField label="Anticuerpos anti-tiroglobulina" name="section13.thyroid.tgAb" value={formData.section13.thyroid.tgAb} onChange={handleInputChange} unit="IU/mL"/>
                </SubSection>
                <SubSection title="13.3 Otros marcadores">
                    <InputField label="Homocisteína" name="section13.other.homocysteine" value={formData.section13.other.homocysteine} onChange={handleInputChange} unit="μmol/L"/>
                    <InputField label="Vitamina A" name="section13.other.vitA" value={formData.section13.other.vitA} onChange={handleInputChange} unit="μg/dL"/>
                    <InputField label="Vitamina E" name="section13.other.vitE" value={formData.section13.other.vitE} onChange={handleInputChange} unit="mg/L"/>
                    <InputField label="Selenio" name="section13.other.selenium" value={formData.section13.other.selenium} onChange={handleInputChange} unit="μg/L"/>
                    <InputField label="Cobre sérico" name="section13.other.serumCopper" value={formData.section13.other.serumCopper} onChange={handleInputChange} unit="μg/dL"/>
                    <InputField label="Ceruloplasmina" name="section13.other.ceruloplasmin" value={formData.section13.other.ceruloplasmin} onChange={handleInputChange} unit="mg/dL"/>
                </SubSection>
            </Section>



            {/* Final section */}
            <Section title="CONSENTIMIENTO Y FIRMA">
                <p className="text-sm text-gray-600 mb-6">He completado este cuestionario con información veraz y completa según mi mejor conocimiento. Entiendo que esta información será utilizada para desarrollar un plan de tratamiento nutricional personalizado para mis condiciones de salud.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Firma del paciente" name="consent.patientSignature" value={formData.consent.patientSignature} onChange={handleInputChange} />
                    <InputField label="Fecha" name="consent.patientDate" type="date" value={formData.consent.patientDate} onChange={handleInputChange} />
                </div>
            </Section>


          <div className="mt-12 flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl shadow-xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg sm:text-base"
              >
                Enviar Cuestionario
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
