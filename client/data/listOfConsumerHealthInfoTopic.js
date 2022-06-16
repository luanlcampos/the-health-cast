/**
 * This list was obtained from MedlinePlus organization. MedlinePlus is an online health information resource for patients, consumers and their families and friends.
 Source - https://medlineplus.gov/all_healthtopics.html
 */
const consumerHealthInfoTopics = [`A1C`,
    `AAA`,
    `Abdominal Aortic Aneurysm`,
    `Abdominal Pregnancy`,
    `Abnormalities`,
    `ABO Blood Groups`,
    `About Your Medicines`,
    `ABPA`,
    `Abuse`,
    `Accident Prevention`,
    `Accidents`,
    `Achalasia`,
    `Achilles Tendon Injuries`,
    `Achondroplasia`,
    `Acid Reflux`,
    `ACL Injuries`,
    `Acne Rosacea`,
    `Acquired Immunodeficiency Syndrome`,
    `Acromegaly`,
    `Actinic Keratosis`,
    `Acute Lymphoblastic Leukemia`,
    `Acute Myeloblastic Leukemia`,
    `Acute Pancreatitis`,
    `Acute Respiratory Distress Syndrome`,
    `ADD`,
    `Adenoidectomy`,
    `Adenoma`,
    `Adenomyosis`,
    `Adenovirus Infections`,
    `ADHD`,
    `Adolescent Development`,
    `Adolescent Health`,
    `Adolescent Pregnancy`,
    `Adrenal Insufficiency`,
    `Adrenoleukodystrophy`,
    `Adult Immunization`,
    `AF`,
    `Affordable Care Act`,
    `Age-Related Macular Degeneration`,
    `Agent Orange`,
    `Ageusia`,
    `Aging`,
    `Aging Skin`,
    `Agoraphobia`,
    `AIDS`,
    `AIDS and Infections`,
    `AIDS and Pregnancy`,
    `AIDS in Women`,
    `AIDS Medicines`,
    `AIDS--Living With AIDS`,
    `Airsickness`,
    `Alagille Syndrome`,
    `Alaska Native Health`,
    `Alcohol Abuse`,
    `Alcohol Abuse in Pregnancy`,
    `Alcohol and Youth`,
    `Alcohol Consumption`,
    `Alcohol Dependence`,
    `Alcohol Withdrawal`,
    `Alcoholic Fatty Liver Disease`,
    `Alcoholism`,
    `ALL`,
    `Allergic Bronchopulmonary Aspergillosis`,
    `Allergic Rhinitis`,
    `Allergy, Food`,
    `Allergy, Latex`,
    `Alopecia`,
    `Alpha-tocopherol`,
    `ALS`,
    `Alternative Medicine`,
    `Alternative Therapy for Cancer`,
    `AMD`,
    `Amenorrhea`,
    `American Indian Health`,
    `AML`,
    `Amnesia`,
    `Amniocentesis`,
    `Amphetamines`,
    `Amputation`,
    `Analgesics`,
    `Anencephaly`,
    `Angiitis`,
    `Animal Health`,
    `Annual Physical Examination`,
    `Anorexia Nervosa`,
    `Anosmia`,
    `Anterior Cruciate Ligament Injury`,
    `Anti-platelet drugs`,
    `Anticoagulants`,
    `Antihypertensive Medicines`,
    `Antimicrobial Resistance`,
    `Antisocial Personality Disorder`,
    `Aortic Dissection`,
    `Aortic Stenosis`,
    `Aphthous Ulcers`,
    `Apnea, Sleep`,
    `Arachnoiditis`,
    `Arctic Health`,
    `ARDS`,
    `Arnold-Chiari Malformation`,
    `Arteriosclerosis`,
    `Arteriosclerosis of Extremities`,
    `Arteriosclerosis, Coronary`,
    `Arthrography`,
    `Arthroplasty`,
    `Arthroscopy`,
    `Artificial Feeding`,
    `Artificial Insemination`,
    `Artificial Lens`,
    `Asbestosis`,
    `Ascorbic Acid`,
    `Aseptic Meningitis`,
    `Aseptic Necrosis`,
    `Asperger Syndrome`,
    `Assisted Breathing`,
    `Astigmatism`,
    `Ataxia`,
    `Atelectasis`,
    `Atherosclerosis, Coronary`,
    `Atopic Dermatitis`,
    `Auditory Tumor`,
    `Autism`,
    `Autoinflammatory Disorders`,
    `Automated External Defibrillators`,
    `Automobile Safety`,
    `Avascular Necrosis`,
    `Avian Influenza`,
    `AVM`,
    `Babesiosis`,
    `Baby Blues`,
    `Baby Care`,
    `Bacteremia`,
    `Bacterial Vaginosis`,
    `Baker's Cyst`,
    `Balanitis`,
    `Bariatric Surgery`,
    `Barrett's Esophagus`,
    `Basal Cell Carcinoma`,
    `Basedow's Disease`,
    `Bedsores`,
    `Bee Stings`,
    `Belching`,
    `Bellyache`,
    `Benign Prostatic Hypertrophy`,
    `Berry Aneurysm`,
    `Bi-polar Disorder`,
    `Bicycle Safety`,
    `Biliary Cirrhosis`,
    `Biliary Tract Diseases`,
    `Binge Drinking`,
    `Binge Eating`,
    `Bioethics`,
    `Biological Weapons`,
    `Bioterrorism`,
    `Biotin`,
    `Birth Injuries`,
    `Bisexual Health`,
    `Black Widow Spider Bites`,
    `Bladder Control`,
    `Bladder Infections`,
    `Bladder Pain Syndrome`,
    `Bleeding, Gastrointestinal`,
    `Blepharospasm`,
    `Blindness`,
    `Blood Cells`,
    `Blood Clots in the Lung`,
    `Blood Coagulation Disorders`,
    `Blood Donation`,
    `Blood Glucose`,
    `Blood Platelet Disorders`,
    `Blood Poisoning`,
    `Blood Pressure`,
    `Blood Tests`,
    `Blood-Borne Pathogens`,
    `BMI`,
    `Body Art`,
    `Body Contouring`,
    `Body Odor`,
    `Bone Loss`,
    `Bone Transplantation`,
    `Borderline Personality Disorder`,
    `Botanicals`,
    `Botulinum Toxin`,
    `Bovine Spongiform Encephalopathy`,
    `Bowel Obstruction`,
    `BPH`,
    `Braces, Oral`,
    `Brachytherapy`,
    `Bradycardia`,
    `Brain Attack`,
    `Brain Cancer`,
    `Brain Concussion`,
    `Brain Disorders, Inborn Genetic`,
    `Brain Hemorrhage `,
    `Brain Injury`,
    `Break-bone Fever`,
    `Breast Cancer, Male`,
    `Breast Implants`,
    `Breast Reduction`,
    `Breath Odor`,
    `Breathing Rate`,
    `Broken Bones`,
    `Bronchial Asthma`,
    `Bronchiectasis`,
    `Bronchiolitis`,
    `Bronchitis`,
    `Bronchogenic Carcinoma`,
    `Bronchopneumonia`,
    `Brown Recluse Spider Bites`,
    `Bruxism`,
    `BSE`,
    `Bubonic Plague`,
    `Bulimia`,
    `Bullous Pemphigoid`,
    `Bunions`,
    `Burping`,
    `Bypass Surgery`,
    `C-Section`,
    `CABG`,
    `CAD`,
    `Calluses`,
    `CAM`,
    `Canavan Disease`,
    `Cancer and Pregnancy`,
    `Candidiasis`,
    `Canes`,
    `Cannabis`,
    `Car Safety`,
    `Car Seats`,
    `Carcinoma`,
    `Cardiac Arrest`,
    `Cardiac Diseases`,
    `Cardiac Failure`,
    `Cardiac Surgery`,
    `Cardiac Test`,
    `Cardiopulmonary Resuscitation`,
    `Cardiospasm`,
    `Cardiovascular Diseases`,
    `Careers`,
    `Caregivers for Alzheimer's Disease`,
    `Carotid Endarterectomy`,
    `Carsickness`,
    `Cat Bites`,
    `CAT Scans`,
    `Causalgia`,
    `Cavities`,
    `Cell Phones`,
    `Cephalic Disorders`,
    `Cerebral Aneurysm`,
    `Cerebral Hemorrhage `,
    `Cerebrovascular Disease`,
    `Cervical Dysplasia`,
    `Cervical Pregnancy`,
    `Cervical Spine`,
    `CFS`,
    `Chalazion`,
    `Change of Life`,
    `Charley Horse`,
    `Chemical Warfare`,
    `Chemical Weapons`,
    `Chemotherapy`,
    `Chest Physical Therapy`,
    `Chewing Tobacco`,
    `CHF`,
    `Chilblains`,
    `Child Molestation`,
    `Childhood Asthma`,
    `Childhood Cancer`,
    `Childhood Obesity`,
    `Children and Diabetes`,
    `Children and Medicines`,
    `Cholangiocarcinoma`,
    `Cholangitis`,
    `Cholecystectomy`,
    `Choledocholithiasis`,
    `Cholelithiasis`,
    `Cholestasis`,
    `Chondrocalcinosis`,
    `Chondromalacia Patellae`,
    `Chorea`,
    `Chorionic Villi Sampling`,
    `Chromium`,
    `Chronic Granulocytic Leukemia`,
    `Chronic Granulomatous Disease`,
    `Chronic Illness, Coping`,
    `Chronic Myelogenous Leukemia`,
    `Chronic Obstructive Pulmonary Disease`,
    `Chronic Pancreatitis`,
    `Churg-Strauss Syndrome`,
    `Cicatrix`,
    `Circulatory Disorders`,
    `CJD`,
    `CKD`,
    `Clap`,
    `Claudication`,
    `Clavicle Injuries`,
    `Cleaning Products`,
    `Cleft Palate`,
    `Cleft Spine`,
    `CLL`,
    `Clostridioides difficile infections`,
    `Clostridium difficile infections`,
    `Cluster Headache`,
    `CML`,
    `CMV Infections`,
    `CO Poisoning`,
    `Coal Miner's Lung`,
    `Coccidioidomycosis`,
    `Coccyx`,
    `Cold (Temperature)`,
    `Cold, Common`,
    `Colic`,
    `Colitis`,
    `Collarbone Injuries`,
    `Colon Cancer`,
    `Colorado Tick Fever`,
    `Colostomy`,
    `Communicable Diseases`,
    `Communicating With Your Healthcare Provider`,
    `Communication Disorders`,
    `Compression Fracture`,
    `Conduct Disorder`,
    `Condylomata Acuminata`,
    `Confidentiality`,
    `Congenital Adrenal Hyperplasia`,
    `Congenital Diaphragmatic Hernia`,
    `Congestive Heart Failure`,
    `Conjunctivitis`,
    `Contact Dermatitis`,
    `Contact Lenses`,
    `Contraception`,
    `Contusions`,
    `Cooley's Anemia`,
    `Copper`,
    `Copper Storage Disease`,
    `Cor Pulmonale`,
    `Cord Blood`,
    `Corn Syrup`,
    `Coronary Arteriosclerosis`,
    `Coronary Artery Bypass Graft`,
    `Corticosteroids`,
    `Cosmetic Surgery`,
    `Costochondritis`,
    `Cough Medicines`,
    `Coxsackievirus Infections`,
    `Crab Lice`,
    `Crack`,
    `Cramps`,
    `Cranial Injuries`,
    `Craniofacial Injuries`,
    `Craniosynostosis`,
    `Crib Death`,
    `Crossed Eyes`,
    `Crutches`,
    `Cryptococcosis`,
    `Cubital Tunnel Syndrome`,
    `Cutaneous Disorders`,
    `Cutting`,
    `CVA`,
    `Cyclothymic Disorder`,
    `Cystic Kidney Diseases`,
    `Cystitis`,
    `Cystocele`,
    `Dandy-Walker Syndrome`,
    `DASH Diet`,
    `Day Care`,
    `Deafness`,
    `Death and Dying`,
    `Decubitus Ulcers`,
    `Defibrillators, Implantable`,
    `Degenerative Joint Disease`,
    `Delivery`,
    `Dementia with Lewy Bodies`,
    `Dental Caries`,
    `Dental Health, Child`,
    `Dental Implants`,
    `Dental Sealants`,
    `Depression, Teen`,
    `Dermatitis`,
    `Dermatology`,
    `Dermatomyositis`,
    `Diabetes Mellitus`,
    `Diabetes Prevention`,
    `Diabetic Nephropathy`,
    `Diabetic Retinopathy`,
    `Diaper Rash`,
    `Diaphragmatic Hernia`,
    `Dietary Sodium`,
    `Dieting`,
    `Dip`,
    `Diverticulitis`,
    `Do-Not-Resuscitate Orders`,
    `Dog Bites`,
    `Donors`,
    `Drinking`,
    `Driving`,
    `Dropsy`,
    `Drug abuse`,
    `Drug Abuse in Pregnancy`,
    `Drug Abuse, Prescription`,
    `Drug Allergies`,
    `Drug Errors`,
    `Drug Information`,
    `Drug Interactions`,
    `Drugged Driving`,
    `Drunk Driving`,
    `Dry Eye`,
    `Duchenne Muscular Dystrophy`,
    `Duodenal Ulcer`,
    `Dupuytren Contracture`,
    `DVT`,
    `Dysautonomia`,
    `Dyscalculia`,
    `Dysentery`,
    `Dysfunctional uterine bleeding`,
    `Dysgeusia`,
    `Dyskinesia`,
    `Dyslexia`,
    `Dysmenorrhea`,
    `Dysosmia`,
    `Dyspareunia`,
    `Dyspepsia`,
    `Dysphagia`,
    `Dyspnea`,
    `Dysthymic Disorder`,
    `Dysuria`,
    `EBV Infections`,
    `Ecstasy`,
    `Egg Allergy`,
    `Egg Donation`,
    `Ehrlichiosis`,
    `Electrolytes`,
    `Electronic Health Records`,
    `Emergency Preparedness`,
    `EMF`,
    `Emotional Health`,
    `Employee Health`,
    `Encopresis`,
    `End of Life Care`,
    `End-Stage Renal Disease`,
    `Endometrial Cancer`,
    `Enterocele`,
    `Enterovirus`,
    `Environmental Tobacco Smoke`,
    `Eosinophilia`,
    `Epstein-Barr Virus Infections`,
    `Equipment Safety`,
    `ERT`,
    `Erythema Infectiosum`,
    `Erythroblastosis Fetalis`,
    `ESRD`,
    `Essential Tremor`,
    `Estrogen Replacement Therapy`,
    `Ewing's Sarcoma`,
    `Exercise Benefits`,
    `Exercise: How Much?`,
    `Eyeglasses`,
    `Failure to Thrive`,
    `False Teeth`,
    `Familial Combined Hyperlipidemia`,
    `Familial Dysbetalipoproteinemia`,
    `Familial Hypercholesterolemia`,
    `Familial Hypertriglyceridemia`,
    `Family Planning`,
    `Fanconi Anemia`,
    `Farmer's Lung`,
    `Farsightedness`,
    `FAS`,
    `Fats, Dietary`,
    `Fecal Impaction`,
    `Female Circumcision`,
    `Female Sexual Dysfunction`,
    `Female Sterilization`,
    `Ferritin`,
    `Fertility`,
    `Fetal Alcohol Syndrome`,
    `Fetal Ultrasound`,
    `Fever Blister`,
    `Fiber`,
    `Fibrocystic Breast Disease`,
    `Fibroids`,
    `Finding health sources I can trust`,
    `Finding trustworthy information`,
    `Fingernails`,
    `Fitness`,
    `Flatulence`,
    `Flea Bites`,
    `Flesh-Eating Bacteria`,
    `Floater`,
    `Folate`,
    `Folliculitis`,
    `Food Additives`,
    `Food Poisoning`,
    `FRAXA`,
    `Frostnip`,
    `Frozen Shoulder`,
    `Fungicides`,
    `Gait Abnormalities`,
    `Gambling`,
    `Gamete Intrafallopian Transfer`,
    `Ganglion Cyst`,
    `Gas Gangrene`,
    `Gastric Bypass`,
    `Gastric Cancer`,
    `Gastric Disorders`,
    `Gastritis`,
    `Gastroesophageal Reflux`,
    `Gastrointestinal Diseases`,
    `Gastrointestinal Stromal Tumors`,
    `Gastroparesis`,
    `Gastroplasty`,
    `Generalized Anxiety Disorder`,
    `Geographic Tongue`,
    `Germ Warfare`,
    `German Measles`,
    `Gestational Carrier `,
    `Gestational Diabetes`,
    `Gestational Hypertension`,
    `Gestational Trophoblastic Disease`,
    `GHB`,
    `GI Bleeding`,
    `Gilbert Disease`,
    `Glandular Fever`,
    `Glasses`,
    `Glioma`,
    `Global Health`,
    `Global Warming`,
    `Glossitis`,
    `Glucocorticoids`,
    `Glucose`,
    `Glucose-6-phosphate Dehydrogenase Deficiency`,
    `Gluten Intolerance`,
    `Gluten-Sensitive Enteropathy`,
    `Goiter`,
    `Graves' Disease`,
    `Grief`,
    `Grippe`,
    `Gulf Oil Spill`,
    `Gulf War Syndrome`,
    `Gynecomastia`,
    `H. Pylori Infections`,
    `Hair Pulling`,
    `Hairy Cell Leukemia`,
    `Halitosis`,
    `Hallucinogens`,
    `Hammer Toe`,
    `Hand, Foot, and Mouth Disease`,
    `Handwashing`,
    `Hansen's Disease`,
    `Hardening of the Arteries`,
    `Hashimoto's Disease`,
    `Health Equity`,
    `Health Maintenance Organizations`,
    `Healthy Eating`,
    `Heart Defects`,
    `Heart Disease Prevention`,
    `Heart Diseases, Congenital`,
    `Heart Diseases--Rehabilitation`,
    `Heart Murmur`,
    `Heart Rate`,
    `Heart Test`,
    `Heat Exhaustion`,
    `Heimlich Maneuver`,
    `Hemangioma`,
    `Hematologic Disorders`,
    `Hematoma`,
    `Hematuria`,
    `Hemiplegia`,
    `Hemodialysis`,
    `Hemoglobin A1c`,
    `Hemoglobin SS Disease`,
    `Hemolytic Disease of Newborn`,
    `Hemorrhage`,
    `Hepatic Diseases`,
    `Hepatic Transplantation`,
    `Hepatoblastoma`,
    `Hepatocellular Carcinoma`,
    `Hepatolenticular Degeneration`,
    `Herbicides`,
    `Herpes Genitalis`,
    `Herpes Zoster`,
    `Herpes, Oral`,
    `Hib`,
    `High Blood Glucose`,
    `High Blood Pressure Medicines`,
    `High Blood Pressure Prevention`,
    `High Blood Sugar`,
    `High Risk Pregnancy`,
    `HIPAA`,
    `HIV/AIDS--Living With`,
    `HMO`,
    `Hoarding`,
    `Homeopathy`,
    `Homosexuality`,
    `Horner Syndrome`,
    `Hospitals`,
    `Hot (Temperature)`,
    `Hot Flashes`,
    `HPV Vaccine`,
    `HRT`,
    `Huffing`,
    `Human Genome Project`,
    `Human Immunodeficiency Virus`,
    `Human Papillomavirus`,
    `Hydrophobia`,
    `Hyperactivity`,
    `Hyperbaric Oxygen`,
    `Hypercalcemia`,
    `Hypercholesterolemia`,
    `Hypereosinophilic Syndrome`,
    `Hyperhidrosis`,
    `Hyperkalemia`,
    `Hyperlipidemia`,
    `Hypermobility Syndrome`,
    `Hypernephroma`,
    `Hyperopia`,
    `Hyperparathyroidism`,
    `Hyperpigmentation`,
    `Hypersensitivity`,
    `Hypertension`,
    `Hypertension, Pulmonary`,
    `Hypertriglyceridemia`,
    `Hypertrophic Scar`,
    `Hyperuricemia`,
    `Hypocalcemia`,
    `Hypoglycemic Medicines`,
    `Hypokalemia`,
    `Hyponatremia`,
    `Hypoparathyroidism`,
    `Hypopharyngeal Cancer`,
    `Hypopigmentation`,
    `Hypotension`,
    `IBS`,
    `Icterus`,
    `ICU`,
    `Identifying health misinformation`,
    `Ileostomy`,
    `Immunization, Childhood`,
    `Impacted Tooth`,
    `Implantable Defibrillators`,
    `Impotence`,
    `In Vitro Fertilization`,
    `In-home Care`,
    `Incontinence`,
    `Infantile Paralysis`,
    `Infections, Bacterial`,
    `Infections, Bladder`,
    `Infections, Fungal`,
    `Infections, Viral`,
    `Infertility, Female`,
    `Infertility, Male`,
    `Inflammatory Bowel Disease`,
    `Influenza`,
    `Influenza Vaccine`,
    `Informed Consent`,
    `Ingrown Nail`,
    `Inguinal Hernia`,
    `Injuries`,
    `Insect Repellents`,
    `Insecticides`,
    `Insulin`,
    `Insulin Resistance`,
    `Insulin-Dependent Diabetes Mellitus`,
    `Insurance`,
    `Integrative Medicine`,
    `Intermittent Claudication`,
    `Interstitial Pneumonitis`,
    `Intestinal Diseases`,
    `Intestinal Volvulus`,
    `Intracranial Aneurysm`,
    `Intraocular Lens`,
    `Intraocular Melanoma`,
    `Intussusception`,
    `Iron Deficiency Anemia`,
    `Iron Overload Disease`,
    `Irregular Heartbeat`,
    `Islet Cell Carcinoma`,
    `IUD`,
    `IVF`,
    `Jakob-Creutzfeldt Disease`,
    `Jet Lag`,
    `Jock Itch`,
    `Juvenile Diabetes`,
    `Juvenile Rheumatoid Arthritis`,
    `Keloids`,
    `Kernicterus`,
    `Kidney Biopsy`,
    `Kidney Function Tests`,
    `Kidney Infections`,
    `Kyphosis`,
    `Labor`,
    `Lacerations`,
    `Language Problems`,
    `Large for Gestational Age`,
    `Laryngeal Cancer`,
    `Laryngitis`,
    `Laryngopharyngeal Cancer`,
    `LASIK`,
    `Lassa Fever`,
    `Lazy Eye`,
    `Leg Cramps`,
    `Legg-Calve-Perthes Disease`,
    `Leprosy`,
    `Lesbian Health`,
    `Leukemia, Acute Lymphoblastic`,
    `Leukemia, Acute Lymphocytic`,
    `Leukemia, Childhood`,
    `Leukemia, Chronic Lymphocytic`,
    `Leukemia, Myeloblastic, Acute`,
    `Leukemia, Myelogenous, Acute`,
    `Leukemia, Myeloid, Acute`,
    `Leukemia, Myeloid, Chronic`,
    `Life Support`,
    `Ligament Injuries`,
    `Lightning Strikes`,
    `Liver Cirrhosis`,
    `Liver Spots`,
    `Living Wills`,
    `Living with Cancer`,
    `Lockjaw`,
    `Long-Term Care`,
    `Lou Gehrig's Disease`,
    `Low Back Pain`,
    `Low Birth Weight`,
    `Low Blood Sugar`,
    `Low Cholesterol Diet`,
    `Low Sperm Count`,
    `Low Vision`,
    `LTK`,
    `Lumbago`,
    `Lumpectomy`,
    `Lung Rehabilitation`,
    `Lymph Nodes`,
    `Lymphatic Obstruction`,
    `Mad Cow Disease`,
    `Magnesium`,
    `Magnetic Resonance Imaging`,
    `Makeup`,
    `Male Genital Disorders`,
    `Male Menopause`,
    `Male Sterilization`,
    `Malignancy`,
    `Mammaplasty`,
    `Man-Made Disasters`,
    `Mandibular Disorders`,
    `Manic-Depressive Illness`,
    `Maple Syrup Urine Disease`,
    `Maternal Health`,
    `Maxillary Disorders`,
    `MCI`,
    `MDMA`,
    `MDS`,
    `Mediastinal Disorders`,
    `Medical Professions`,
    `Medical Research`,
    `Medicinal Herbs`,
    `Medicines and Pregnancy`,
    `Medicines, Over-the-Counter`,
    `Mediterranean Anemia`,
    `Meningioma`,
    `Meningococcemia`,
    `Meniscus`,
    `Menopausal Hormone Therapy`,
    `Menopause, Male`,
    `Mental Health, Child`,
    `Mental Health, Older Adults`,
    `Mental Health, Teen`,
    `Mental Retardation`,
    `Merkel Cell Cancer`,
    `Methadone`,
    `Methicillin Resistant Staphylococcus Aureus`,
    `MI`,
    `Micturition`,
    `Military Health`,
    `Milk Allergy`,
    `Milk Intolerance`,
    `Mini-Stroke`,
    `Mixed Connective Tissue Disease`,
    `Molar Pregnancy`,
    `Molluscum Contagiosum`,
    `Moniliasis`,
    `Mono`,
    `Mononucleosis`,
    `Morphea`,
    `Morton's Neuroma`,
    `Mouth Cancer`,
    `MS`,
    `Mucocutaneous Lymph Node Syndrome`,
    `Mucolipidoses`,
    `Mucopolysaccharidoses`,
    `Multifocal Atrial Tachycardia`,
    `Multiple Births`,
    `Multiple Endocrine Neoplasia`,
    `Multiple System Atrophy`,
    `Muscle Strain`,
    `Mycoses`,
    `Myelomeningocele`,
    `Myeloproliferative Disorders`,
    `Myocardial Infarction`,
    `Myopathies`,
    `Myopia`,
    `Narcissism`,
    `Narcolepsy`,
    `Narcotics`,
    `Nasal Disorders`,
    `Nasopharyngeal Cancer`,
    `Natural Disasters`,
    `Nearsightedness`,
    `Necrotizing Fasciitis`,
    `Neoplasms`,
    `Nephritis`,
    `Nephroblastoma`,
    `Nephrolithiasis`,
    `Nerve Diseases`,
    `Nervous System Diseases`,
    `Neurodegenerative Diseases`,
    `Neurogenic Bladder`,
    `Neuroma, Acoustic`,
    `Neuropathy`,
    `Nevus`,
    `Niacin`,
    `Nicotine`,
    `Niemann-Pick Disease`,
    `Night Terrors`,
    `Non-Hodgkin Lymphoma`,
    `Non-Insulin Dependent Diabetes Mellitus`,
    `Non-Prescription Drugs`,
    `Non-Small Cell Lung Cancer`,
    `Nonalcoholic Fatty Liver Disease`,
    `Nontropical Sprue`,
    `Norwalk Virus Infections`,
    `Nosebleed`,
    `Nut Allergy`,
    `Nutrition and Pregnancy`,
    `Nutrition Labeling`,
    `Nutrition, Child`,
    `Nystagmus`,
    `Obesity Surgery`,
    `Occupational Injuries`,
    `Occupational Therapy`,
    `OCD`,
    `Ombudsman Programs`,
    `Omega-3 Fatty Acids`,
    `Oncology`,
    `Onychomycosis`,
    `Open Heart Surgery`,
    `Open Spine`,
    `Operation`,
    `Ophthalmology`,
    `Opiates`,
    `Opioid Abuse and Addiction`,
    `Opioid Abuse and Addiction Treatment`,
    `Opportunistic Infections in AIDS`,
    `Oral Health`,
    `Oral Health, Child`,
    `Oral Herpes`,
    `Oral Tobacco`,
    `Oropharyngeal Cancer`,
    `Orthostatic Hypotension`,
    `Osteitis Deformans`,
    `Osteomalacia `,
    `Osteomyelitis`,
    `Osteopenia`,
    `Osteosarcoma`,
    `OTC Medicines`,
    `Otitis Media`,
    `Ovarian Insufficiency`,
    `Overactive Thyroid`,
    `Overweight`,
    `Pacific Islander Health`,
    `PAD`,
    `Paget's Disease of Breast`,
    `Pain, Abdominal`,
    `Pain, Back`,
    `Pain, Chest`,
    `Pain, Chronic`,
    `Painful Bladder Syndrome`,
    `Painkillers`,
    `Pantothenic Acid`,
    `Paralysis Agitans`,
    `Paralysis, Infantile`,
    `Paralytic Ileus`,
    `Paranasal Sinus Cancer`,
    `Paraplegia`,
    `Parenteral Nutrition`,
    `Paronychia`,
    `Parotid Gland Cancer`,
    `Parotid Gland Disorders`,
    `Partner Abuse`,
    `Passive Smoking`,
    `Patella`,
    `Paternity Testing`,
    `Pathological Gambling`,
    `Patient Portals`,
    `Patient Records`,
    `PCOS`,
    `Peanut Allergy`,
    `Pediatrics`,
    `Pee`,
    `Pelvic Exam`,
    `Pelvis`,
    `Pemphigoid`,
    `Penile Disorders`,
    `PEP`,
    `Performance-Enhancing Drugs`,
    `Pericardial Effusion`,
    `Pericarditis`,
    `Perimenopause`,
    `Periodontal Disease`,
    `Peritoneal Dialysis`,
    `Peritonitis`,
    `Persian Gulf War`,
    `Persistent Vegetative State`,
    `Perspiration`,
    `Pertussis`,
    `Pervasive Developmental Disorder`,
    `PET Scans`,
    `Pets`,
    `Peyronie's Disease`,
    `Pfiesteria Infections`,
    `Phantom Limb`,
    `Pharyngeal Cancer`,
    `Pharyngitis`,
    `Pharynx Disorders`,
    `Phosphorus`,
    `Physical Fitness`,
    `Physical Therapy`,
    `Phytotherapy`,
    `Pica`,
    `PID`,
    `Piles`,
    `Pilonidal Cyst`,
    `Pimples`,
    `Pinguecula`,
    `PKU`,
    `Plantar Fasciitis`,
    `Plantar Warts`,
    `Plaque, Atherosclerotic`,
    `Plaque, Dental`,
    `Plasma-cell Myeloma`,
    `Plasmacytoma`,
    `Pleural Effusion`,
    `Pleurisy`,
    `Plumbism`,
    `PMS`,
    `Pneumoconiosis`,
    `Pneumonic Plague`,
    `Pneumothorax`,
    `Poison Oak`,
    `Poison Sumac`,
    `Poisons in the Home`,
    `Poliomyelitis`,
    `Pollen Allergy`,
    `Pollution`,
    `Polychondritis`,
    `Polycystic Kidney Disease`,
    `Polymyositis`,
    `Poop`,
    `Positional Plagiocephaly`,
    `Post-herpetic Neuralgia`,
    `Post-polio Syndrome`,
    `Post-Treatment Lyme Disease Syndrome`,
    `Postoperative Care`,
    `Postural Orthostatic Tachycardia Syndrome`,
    `Posture`,
    `PPS`,
    `Prednisone`,
    `Preeclampsia`,
    `Preemies`,
    `Pregnancy and AIDS`,
    `Pregnancy and Diabetes`,
    `Pregnancy and Health Problems`,
    `Pregnancy and Substance Abuse`,
    `Pregnancy Hazards`,
    `Pregnancy Loss`,
    `Pregnancy, High-Risk`,
    `Pregnancy, Infections in`,
    `Pregnancy, Teen`,
    `Premature Birth`,
    `Premature Ejaculation`,
    `Premature Labor`,
    `Premature Menopause`,
    `Premature Ovarian Failure`,
    `PrEP`,
    `Presbycusis`,
    `Presbyopia`,
    `Prescription Drug Abuse`,
    `Prevention`,
    `Primary Pulmonary Hypertension`,
    `Prion Diseases`,
    `Privacy`,
    `PRK`,
    `Proctitis`,
    `Progeria`,
    `Prolactinoma`,
    `Prosthetic Limbs`,
    `Protective Eye Wear`,
    `Proteins`,
    `Proteinuria`,
    `Pruritus`,
    `Pruritus Ani`,
    `Pseudogout`,
    `Psychiatric Disorders`,
    `Psychological Stress`,
    `Ptosis`,
    `PTSD`,
    `Pulmonary Emphysema`,
    `Pulse`,
    `PXE`,
    `Pyelonephritis`,
    `Pyrexia`,
    `Q Fever`,
    `Quackery`,
    `Quadriplegia`,
    `Radiography`,
    `Radionuclide Scans`,
    `Radiosurgery`,
    `Radiotherapy`,
    `Rape`,
    `Reactive Arthritis`,
    `Reading Problems`,
    `Recreational Safety`,
    `Rectal Bleeding`,
    `Rectal Cancer`,
    `Rectocele`,
    `Reflex Sympathetic Dystrophy`,
    `Regional Enteritis`,
    `Regional Ileitis`,
    `Reiter's Syndrome`,
    `Renal Cancer`,
    `Renal Dialysis`,
    `Renal Disease`,
    `Renal Failure`,
    `Renal Transplantation`,
    `Repetitive Motion Injuries`,
    `Residential Care`,
    `Respiratory Diseases`,
    `Resuscitation Orders`,
    `Retinoblastoma`,
    `Retinol`,
    `Rhabdomyolysis`,
    `Rhabdomyosarcoma`,
    `Rheumatic Fever`,
    `Rheumatoid Spondylitis`,
    `Rib Injuries`,
    `Riboflavin`,
    `Ringworm`,
    `RLS`,
    `Rocky Mountain Spotted Fever`,
    `Rodenticides`,
    `Roentgen Rays`,
    `Rohypnol`,
    `Root Canal`,
    `Roseola`,
    `RSV Infections`,
    `Rubeola`,
    `Runaways`,
    `Ruptured Disk`,
    `SAD`,
    `Safety, Child`,
    `Salt`,
    `Sarcoma, Ewing's`,
    `Sarcoma, Soft Tissue`,
    `SCA`,
    `Scapula Injuries`,
    `Scarlet Fever`,
    `SCID`,
    `Screening Tests`,
    `Screening, Newborn`,
    `Seasickness`,
    `Seasonal Allergies`,
    `Seborrheic Dermatitis`,
    `Second Opinion`,
    `Selenium`,
    `Semen`,
    `Seminoma`,
    `Senility`,
    `Seniors' Fitness`,
    `Seniors' Mental Health`,
    `Seniors' Nutrition`,
    `Septic Arthritis`,
    `Septic Shock`,
    `Septic Systems`,
    `Septicemia`,
    `Severe Combined Immunodeficiency`,
    `Sewage`,
    `Sex`,
    `Sexual Abuse of Children`,
    `Sexual Health, Teen`,
    `Shaken Baby Syndrome`,
    `Shaking Palsy`,
    `Shellfish Allergy`,
    `Shoes`,
    `Shortness of Breath`,
    `Shoulder Dislocation`,
    `Shoulder Impingement`,
    `Shy-Drager Syndrome`,
    `Sickle Cell Anemia`,
    `SIDS`,
    `Sigmoidoscopy`,
    `Singultus`,
    `Sinus Cancer`,
    `Sinus Infection`,
    `Skin Rash`,
    `Skull Fractures`,
    `Skull Injuries`,
    `SLE`,
    `Sleep Hygeine`,
    `Sleep-disordered Breathing`,
    `Slipped Disk`,
    `SMA`,
    `Small Cell Lung Cancer`,
    `Small for Gestational Age`,
    `Small Intestine Cancer`,
    `Smelling Disorders`,
    `Smoke Inhalation`,
    `Smoking Cessation`,
    `Smoking in Pregnancy`,
    `Smoking, Passive`,
    `Snake Bites`,
    `SNRI `,
    `Snuff`,
    `Social Anxiety Disorder`,
    `Social Phobia`,
    `South American Trypanosomiasis`,
    `Spasmodic Torticollis`,
    `Spasticity`,
    `Specific Learning Disorder`,
    `Sperm Donation`,
    `Spider Veins`,
    `Spit Tobacco`,
    `Splenic Diseaess`,
    `Splenomegaly`,
    `Splinters`,
    `Spondylitis, Ankylosing`,
    `Spondylolisthesis`,
    `Spontaneous Abortion`,
    `Spouse Abuse`,
    `Squint`,
    `SSRIs`,
    `Stammering`,
    `Statistics`,
    `Staying Healthy`,
    `STD`,
    `Steele-Richardson-Olszewski Syndrome`,
    `Stein-Leventhal Syndrome`,
    `Stem Cell Transplantation`,
    `Stepfamilies`,
    `Sterility`,
    `Sterilization`,
    `Steroids, Anabolic`,
    `Still's Disease`,
    `Stoma`,
    `Stomach Ache`,
    `Stomach Flu`,
    `Stomach Stapling`,
    `Stomach Ulcer`,
    `Stool`,
    `Strabismus`,
    `Strep Throat`,
    `Streptococcus Pneumoniae Infections`,
    `Stress Incontinence`,
    `Stye`,
    `Subarachnoid Hemorrhage `,
    `Substance Abuse`,
    `Substance Abuse in Pregnancy`,
    `Sudden Cardiac Death`,
    `Sugar`,
    `Sugar Diabetes`,
    `Sugar Substitutes`,
    `Sunburn`,
    `Sunscreen`,
    `Sunstroke`,
    `Surgery, Plastic`,
    `Surrogate `,
    `Sweeteners, Artificial`,
    `Swelling`,
    `Swimmer's Ear`,
    `Swine Flu`,
    `Swollen Glands`,
    `Syncope`,
    `Syndrome X (Cardiac)`,
    `Syndrome X (Metabolic)`,
    `Systemic Lupus Erythematosus`,
    `Systemic Sclerosis`,
    `TAA`,
    `Tachycardia`,
    `Tachypnea`,
    `Talk to Your Doctor`,
    `Tardive Dyskinesia`,
    `Tattoos`,
    `TB`,
    `TBI`,
    `Teas, Herbal `,
    `Teas, Medicinal`,
    `Teen Drug Abuse`,
    `Teen Nutrition`,
    `Teen Smoking`,
    `Teenage Drinking`,
    `Teens and Diabetes`,
    `Teeth`,
    `Temperature`,
    `Temporal Arteritis`,
    `Tennis Elbow`,
    `Tension Headache`,
    `Terminal Care`,
    `Terrorist Attacks`,
    `Thiamine`,
    `Thirst`,
    `Thoracentesis`,
    `Thoracic Aortic Aneurysm`,
    `Thoracic Injuries`,
    `Three Day Measles`,
    `Thrombocytopenia`,
    `Thrombophlebitis`,
    `Thrush`,
    `Thumb Injuries`,
    `Thyrotoxicosis`,
    `TIA`,
    `Tic Douleureux`,
    `Tickborne Diseases`,
    `Tinea Pedis`,
    `Tiredness`,
    `Tissue Donation`,
    `TMD`,
    `TMJ`,
    `Tobacco Smoking`,
    `Tobacco, Smokeless`,
    `Toenails`,
    `Tongue Cancer`,
    `Tonsillectomy`,
    `Tonsils`,
    `Torticollis`,
    `Toxemia`,
    `Toxic Shock Syndrome`,
    `TPN`,
    `Trace Elements`,
    `Tracheostomy`,
    `Traffic Accidents`,
    `Trans Fats`,
    `Transfusion`,
    `Transgender Health`,
    `Transplantation`,
    `Treacher-Collins Syndrome`,
    `Tribal Health`,
    `Triplets`,
    `Trisomy 21`,
    `Tropical Medicine`,
    `TSC`,
    `Tubal Pregnancy`,
    `Tularemia`,
    `Tumor`,
    `Tumors, Benign`,
    `Type 1 Diabetes`,
    `Type II Diabetes`,
    `Typhoid Fever`,
    `Ulcer, Leg`,
    `Ulcers`,
    `Ultraviolet Rays`,
    `Umbilical Hernia`,
    `Underactive Thyroid`,
    `Underweight`,
    `Undescended Testicle`,
    `Universal Precautions`,
    `Upset Stomach`,
    `Ureteral Cancer`,
    `Urethral Cancer`,
    `Urinary Bladder Cancer`,
    `Urination`,
    `Urine Tests`,
    `Urostomy`,
    `Urticaria`,
    `Uterine bleeding`,
    `Uterine Cervix Disorders`,
    `Uterine Leiomyomata`,
    `Uterine Prolapse`,
    `UTI`,
    `Vaccination`,
    `Vaginal Infections`,
    `Vaginal Yeast Infection`,
    `Vaginismus`,
    `Valvular Heart Diseases`,
    `Vancomycin-Resistant Enterococci`,
    `Vancomycin-Resistant Staphylococcus aureus`,
    `Vaping`,
    `Varicella-Zoster Virus`,
    `Vascular Headache`,
    `Vasovagal Syncope`,
    `vCJD`,
    `Vegan Diet`,
    `Vegans`,
    `Vehicle Safety`,
    `Veins`,
    `Venereal Disease`,
    `Venereal Warts`,
    `Venous Thrombosis`,
    `Ventilators`,
    `Verruca`,
    `Vertigo`,
    `Vestibular Diseases`,
    `Vestibular Schwannoma`,
    `Veterans Health`,
    `Veterinary Medicine`,
    `VHL`,
    `Violence`,
    `Viral Hepatitis`,
    `Vitamin B`,
    `Vocal Cord Problems`,
    `Voicebox Disorders`,
    `Vomiting`,
    `von Recklinghausen's Disease`,
    `von Willebrand's Disease`,
    `VRE`,
    `Vulvodynia`,
    `Waldenstrom's Macroglobulinemia`,
    `Walkers`,
    `Walking Pneumonia`,
    `Walleye`,
    `Water`,
    `Waterborne Diseases`,
    `Weariness`,
    `Wegener's Granulomatosis`,
    `Weight Training`,
    `Weight-Loss Diet`,
    `Wheat Allergy`,
    `Wheelchairs`,
    `Whiplash`,
    `Windpipe Disorders`,
    `WNV`,
    `Wrinkles`,
    `Xerostomia`,
    `Yellow Fever`,
    `Yersinia Enterocolitica`,
    `Youth Violence`,
    `Zinc`,
    `Zits`,
    `Zoonoses`,
]

let list = [];
consumerHealthInfoTopics.forEach((givenTopic) => {
    list = [...list, { value: givenTopic, label: givenTopic }];
});

export default list;