
export interface Medication {
  name: string;
  dose: string;
  freq: string;
  reason: string;
  since: string;
}

export interface FormData {
  patientInfo: {
    evaluationDate: string;
    patientName: string;
    birthDate: string;
    age: string;
    deliveryDate: string;
    postpartumWeeks: string;
  };
  section1: {
    anthropometric: {
      currentWeight: string;
      height: string;
      bmi: string;
      prePregnancyWeight: string;
      prePregnancyBmi: string;
      endPregnancyWeight: string;
      totalWeightGain: string;
      postpartumWeightLoss: string;
    };
    sociodemographic: {
      occupation: string;
      physicalActivity: string;
      homeHelp: string;
      homeHelpProvider: string;
      sleepHours: string;
      interruptedSleep: string;
    };
  };
  section2: {
    diagnosis: {
      edsDiagnosisDate: string;
      geneticTest: string;
      mutation: string;
      mutationDetails: string;
      familyHistory: string;
      familyMember: string;
    },
    cutaneous: {
      skinExtensibility: number;
      atrophicScars: string;
      scarLocation: string;
      woundDehiscence: string;
      easyBruising: string;
      bruisingFrequency: string;
      episiotomyComplications: string;
      complicationDetails: string;
    },
    articular: {
      beightonThumbRight: boolean;
      beightonThumbLeft: boolean;
      beightonPinkyRight: boolean;
      beightonPinkyLeft: boolean;
      beightonElbowRight: boolean;
      beightonElbowLeft: boolean;
      beightonKneeRight: boolean;
      beightonKneeLeft: boolean;
      beightonPalms: boolean;
      dislocations: string;
      shoulderDislocationFreq: string;
      patellaDislocationFreq: string;
      fingerDislocationFreq: string;
      otherDislocation: string;
      subluxations: string;
      subluxationFreq: string;
    },
    comorbidities: {
      spontaneousOrganRupture: boolean;
      pelvicOrganProlapse: boolean;
      hernia: boolean;
      herniaType: string;
      earlyVaricoseVeins: boolean;
      pots: boolean;
      dysautonomia: boolean;
      mcas: boolean;
      gerd: boolean;
      functionalGiDisorders: boolean;
      anxiety: boolean;
      depression: boolean;
    },
    functionalImpact: {
      interferesWithDailyActivities: string;
      interferenceScore: number;
      assistanceDevices: {
        splints: boolean;
        cane: boolean;
        crutches: boolean;
        wheelchair: boolean;
        other: boolean;
        otherDevice: string;
      },
    },
    treatment: {
      physiotherapy: string;
      physioFrequency: string;
      collagenSupplements: string;
      collagenType: string;
      painMeds: {
        nsaids: boolean;
        nsaidsType: string;
        opioids: boolean;
        opioidsType: string;
        other: boolean;
        otherPainMeds: string;
      }
    }
  },
  section3: {
    diagnosis: {
      diagnosisDate: string;
      howDiagnosed: string[];
    };
    labs: {
      date: string;
      glucoseFasting: string;
      insulinFasting: string;
      homaIr: string;
      hba1c: string;
      cPeptide: string;
      totalCholesterol: string;
      ldl: string;
      hdl: string;
      triglycerides: string;
      triglycerideHdlRatio: string;
    };
    symptoms: {
      carbCravings: number;
      postMealFatigue: number;
      weightLossDifficulty: number;
      abdominalWeightGain: number;
      brainFog: number;
      fluctuatingEnergy: number;
    };
    riskFactors: {
      gestationalDiabetes: string;
      requiredInsulin: string;
      gestationalHypertension: string;
      pcos: string;
      familyHistoryT2D: string;
      familyMember: string;
    };
    treatment: {
      metformin: boolean;
      metforminDosage: string;
      otherMeds: boolean;
      otherMedsDesc: string;
      specificDiet: string[];
      otherDiet: string;
    };
  },
  section4: {
      diagnosis: {
          diagnosisDate: string;
          diagnosedBy: string;
          otherDiagnosedBy: string;
          confirmationStudies: string[];
      };
      labs: {
          date: string;
          crp: string;
          hsCrp: string;
          esr: string;
          rf: string;
          antiCcp: string;
          ana: string;
      };
      joints: {
          affected: string[];
          pattern: string;
      };
      pain: {
          rest: number;
          activity: number;
          night: number;
          morningStiffness: string;
          stiffnessDuration: string;
      };
      haq: {
          dressing: string;
          arising: string;
          eating: string;
          walking: string;
          hygiene: string;
          reaching: string;
          gripping: string;
          errands: string;
      };
      qualityOfLife: {
          interferesWithBabyCare: string;
          interferenceScore: number;
          interferesWithLactation: string;
          lactationInterferenceDetails: string;
      };
      treatment: {
          nsaids: boolean;
          nsaidsDesc: string;
          paracetamol: boolean;
          paracetamolDesc: string;
          corticosteroids: boolean;
          corticosteroidsDesc: string;
          dmards: boolean;
          dmardsDesc: string;
          biologics: boolean;
          biologicsDesc: string;
          physiotherapy: boolean;
          physioFreq: string;
          occupationalTherapy: boolean;
          heatCold: boolean;
          acupuncture: boolean;
          massage: boolean;
          otherNonPharma: boolean;
          otherNonPharmaDesc: string;
          glucosamine: boolean;
          glucosamineDosage: string;
          chondroitin: boolean;
          chondroitinDosage: string;
          msm: boolean;
          msmDosage: string;
          collagen: boolean;
          collagenDosage: string;
          otherSupplements: boolean;
          otherSupplementsDesc: string;
      };
  },
  section5: {
      pregnancyHistory: {
          gravida: string;
          para: string;
          deliveryType: string;
          cesareanReason: string;
          complications: string;
          complicationDetails: string;
          edsComplications: string;
          edsComplicationDetails: string;
      };
      lactation: {
          currentlyBreastfeeding: string;
          stoppedDate: string;
          stoppedReason: string;
          lactationType: string;
          proportionBreastmilk: string;
          proportionFormula: string;
          frequencyDay: string;
          frequencyNight: string;
          avgDuration: string;
          pumping: string;
          pumpFrequency: string;
          pumpAmount: string;
      };
      milkProduction: {
          satisfied: string;
          concerns: string[];
      };
      babyGrowth: {
          birthWeight: string;
          currentWeight: string;
          currentWeightDate: string;
          gainingWeight: string;
          wetDiapers: string;
          dirtyDiapers: string;
      };
      postpartumRecovery: {
          firstMenstruation: string;
          firstMenstruationDate: string;
          recoveryRating: string;
          complications: string[];
      };
      epds: {
          q1: string;
          q2: string;
          q3: string;
          q4: string;
          q5: string;
          q6: string;
          q7: string;
          q8: string;
          q9: string;
          q10: string;
      };
  },
  section6: {
    dietaryHistory: {
        mealsPerDay: string;
        snacksPerDay: string;
        breakfastTime: string;
        lunchTime: string;
        dinnerTime: string;
        snackTimes: string;
    };
    recall24h: {
        breakfast: string;
        morningSnack: string;
        lunch: string;
        afternoonSnack: string;
        dinner: string;
        eveningSnack: string;
        water: string;
        coffee: string;
        tea: string;
        juice: string;
        soda: string;
        otherDrinks: string;
    };
    foodFrequency: {
        fish: string;
        seafood: string;
        poultry: string;
        redMeat: string;
        pork: string;
        eggs: string;
        legumes: string;
        tofu: string;
        milk: string;
        yogurt: string;
        cheese: string;
        whiteBread: string;
        wholeBread: string;
        whiteRice: string;
        brownRice: string;
        pasta: string;
        oats: string;
        cereals: string;
        freshFruits: string;
        rawVeggies: string;
        cookedVeggies: string;
        fruitJuices: string;
        oliveOil: string;
        otherOils: string;
        butter: string;
        avocado: string;
        nuts: string;
        fastFood: string;
        frozenMeals: string;
        processedSnacks: string;
        sweets: string;
        sugaryDrinks: string;
    };
    restrictions: {
        patterns: string[];
        allergies: string;
        allergiesDesc: string;
        intolerances: string;
        intolerancesDesc: string;
        avoidedFoods: string;
    };
    giSymptoms: {
        bloating: string;
        gas: string;
        abdominalPain: string;
        constipation: string;
        diarrhea: string;
        nausea: string;
        heartburn: string;
        earlySatiety: string;
        relatedToFood: string;
        relatedFoods: string;
    };
    hydration: {
        fluidIntake: string;
        mainFluids: string;
        excessiveThirst: string;
        urineColor: string;
    };
  },
  section7: {
    supplements: {
        takingSupplements: string;
        multivitamin: boolean;
        multivitaminName: string;
        multivitaminDose: string;
        vitaminD: boolean;
        vitaminDDose: string;
        vitaminC: boolean;
        vitaminCDose: string;
        calcium: boolean;
        calciumDose: string;
        magnesium: boolean;
        magnesiumDose: string;
        iron: boolean;
        ironDose: string;
        zinc: boolean;
        zincDose: string;
        omega3: boolean;
        omega3Dose: string;
        vitaminB12: boolean;
        vitaminB12Dose: string;
        folate: boolean;
        folateDose: string;
    },
    specificSupplements: {
        collagenPeptides: boolean;
        collagenDose: string;
        glycine: boolean;
        glycineDose: string;
        lysine: boolean;
        lysineDose: string;
        proline: boolean;
        prolineDose: string;
        vitaminK2: boolean;
        vitaminK2Dose: string;
        silicon: boolean;
        siliconDose: string;
        copper: boolean;
        copperDose: string;
        manganese: boolean;
        manganeseDose: string;
        inositol: boolean;
        inositolDose: string;
        berberine: boolean;
        berberineDose: string;
        chromium: boolean;
        chromiumDose: string;
        ala: boolean;
        alaDose: string;
        cinnamon: boolean;
        cinnamonDose: string;
        turmeric: boolean;
        turmericDose: string;
        boswellia: boolean;
        boswelliaDose: string;
        ginger: boolean;
        gingerDose: string;
        quercetin: boolean;
        quercetinDose: string;
        msm: boolean;
        msmDose: string;
        glucosamine: boolean;
        glucosamineDose: string;
        chondroitin: boolean;
        chondroitinDose: string;
        probiotics: boolean;
        probioticsName: string;
        other1Name: string;
        other1Dose: string;
        other2Name: string;
        other2Dose: string;
    },
    adherence: {
        consistency: string;
        sideEffects: string;
        sideEffectsDesc: string;
        barriers: string[];
        otherBarrier: string;
    }
  },
  section8: {
      medications: Medication[],
      otcPainkillers: {
          ibuprofen: boolean;
          ibuprofenDose: string;
          naproxen: boolean;
          naproxenDose: string;
          paracetamol: boolean;
          paracetamolDose: string;
          aspirin: boolean;
          aspirinDose: string;
          other: boolean;
          otherDesc: string;
          frequency: string;
      },
      contraception: {
          method: string;
          otherDesc: string;
      },
      mentalHealthMeds: {
          antidepressants: boolean;
          antidepressantsDesc: string;
          anxiolytics: boolean;
          anxiolyticsDesc: string;
          other: boolean;
          otherDesc: string;
      },
      allergies: {
          hasAllergies: string;
          allergiesDesc: string;
      }
  },
  section9: {
    familyHistory: {
        t2d: string;
        t2dWho: string;
        cardiovascular: string;
        cardiovascularWho: string;
        hypertension: string;
        hypertensionWho: string;
        eds: string;
        edsWho: string;
        hypermobility: string;
        hypermobilityWho: string;
        ra: string;
        raWho: string;
        oa: string;
        oaWho: string;
        autoimmune: string;
        autoimmuneDesc: string;
        obesity: string;
        obesityWho: string;
        pcos: string;
        pcosWho: string;
        thyroid: string;
        thyroidWho: string;
        celiac: string;
        celiacWho: string;
    }
  },
  section10: {
    generalSymptoms: {
        fatigue: number;
        morningEnergy: number;
        postMealEnergyDip: number;
        fatigueInterference: number;
        sleepDifficulty: number;
        nightWaking: number;
        unrefreshingSleep: number;
        sadness: number;
        anxiety: number;
        irritability: number;
        apathy: number;
        concentrationDifficulty: number;
        poorMemory: number;
        brainFog: number;
        sweetCravings: number;
        excessiveHunger: number;
        poorAppetite: number;
    },
    specificSymptoms: {
        hypoTremors: string;
        hypoSweating: string;
        hypoDizziness: string;
        hypoConfusion: string;
        hypoHunger: string;
        hypoIrritability: string;
        easyBruising: number;
        fragileSkin: number;
        slowHealing: number;
        unexplainedStretchMarks: string;
        dizzyOnStanding: string;
        palpitations: string;
        heatIntolerance: string;
        tempRegulation: string;
    },
    postpartumChanges: string[]
  },
  section11: {
      physicalActivity: {
          prePregnancyType: string;
          prePregnancyFreq: string;
          prePregnancyDuration: string;
          prePregnancyIntensity: string;
          currentActivity: string;
          currentType: string;
          currentFreq: string;
          currentDuration: string;
          painLimitsActivity: string;
      },
      dailyLife: {
          standingHours: string;
          sittingHours: string;
          lyingHours: string;
      },
      stress: {
          level: number;
          sources: string[];
          otherSource: string;
          management: string[];
          otherManagement: string;
      },
      environment: {
          tobacco: boolean;
          alcohol: string;
          alcoholAmount: string;
          toxins: boolean;
          toxinsDesc: string;
          mold: boolean;
          pets: boolean;
          petsDesc: string;
      },
      socialSupport: {
          livesWith: string[];
          otherLivesWith: string;
          emotionalSupport: number;
          practicalSupport: number;
          isolationLevel: number;
      }
  },
  section12: {
    goals: {
        concern1: string;
        concern2: string;
        concern3: string;
        nutritionGoals: string[];
        otherGoal: string;
    },
    barriers: {
        anticipated: string[];
        otherBarrier: string;
    },
    resources: {
        preparesMeals: string;
        otherMealPrep: string;
        hasAccessTo: string[];
        timeForPrep: string;
    },
    motivation: {
        foodChanges: number;
        supplementChanges: number;
        motivators: string[];
        otherMotivator: string;
    }
  },
  section13: {
      micronutrients: {
          date: string;
          vitD: string;
          vitB12: string;
          folate: string;
          ferritin: string;
          serumIron: string;
          transferrinSat: string;
          tibc: string;
          rbcMagnesium: string;
          serumZinc: string;
      },
      thyroid: {
          date: string;
          tsh: string;
          freeT4: string;
          freeT3: string;
          tpoAb: string;
          tgAb: string;
      },
      other: {
          homocysteine: string;
          vitA: string;
          vitE: string;
          selenium: string;
          serumCopper: string;
          ceruloplasmin: string;
      }
  },
  section14: {
      physicianEvaluation: {
          bloodPressure: string;
          heartRate: string;
          temperature: string;
          respiratoryRate: string;
          nutritionStatus: string;
          hydration: string;
          skin: string;
          joints: string;
          breastExam: string;
      },
      diagnosis: {
          confirmed1: string;
          confirmed2: string;
          confirmed3: string;
          confirmed4: string;
          differential1: string;
          differential2: string;
      },
      plan: {
          labsToOrder: string[];
          otherLabs: string;
          labsDate: string;
          followUpDate: string;
          dietaryInterventions: string;
          supplementProtocol: string;
          referrals: string[];
          otherReferral: string;
          nextAppointment: string;
          followUpFrequency: string;
          monitoringPlan: string;
          additionalNotes: string;
      }
  },
  consent: {
      patientSignature: string;
      patientDate: string;
      physicianSignature: string;
      physicianDate: string;
  }
}
