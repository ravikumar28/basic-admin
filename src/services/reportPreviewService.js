
export const generateReportHTML = async (reportData) => {
  try {
    // Fetch the template file
    const response = await fetch('/templates/dexa_report.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`);
    }
    let template = await response.text();
    console.log(reportData);
    // {
    //     "patientName": "Jaison",
    //     "height": 180,
    //     "weight": 89,
    //     "age": 31,
    //     "gender": "Male",
    //     "dob": "1992-02-01",
    //     "visit_date": "2025-05-31",
    //     "name": "Jaison",
    //     "date_of_exam": "2025-05-31",
    //     "fat_mass": 2332,
    //     "lean_mass": 233,
    //     "bmc": 455,
    //     "total_mass": 3220,
    //     "body_fat_percentage": 72.42,
    //     "muscle_mass": 3342,
    //     "bone_density": 2112,
    //     "body_fat_status_color": "yellow",
    //     "zone_status": "r4wrr",
    //     "muscled_status": "rwrer",
    //     "nutrished_status": "rwrwre",
    //     "suggestion_details": {
    //         "training": "rwrrw",
    //         "nutrition": "rwrwre"
    //     },
    //     "images": [
    //         {
    //             "url": "https://vital-insights.s3.ap-south-1.amazonaws.com/dev/reports/dexa/photo_2025-05-28_11-13-26.jpg",
    //             "name": "Asymmetry",
    //             "type": "asymmetry"
    //         }
    //     ],
    //     "visceral_fat_area": "34",
    //     "visceral_fat": "12",
    //     "andriod_gynoid_fat": "1221",
    //     "body_composition_trunk": "12",
    //     "almi_ffmi": "2112",
    //     "right_arm_status": "21212",
    //     "left_arm_status": "211212",
    //     "right_leg_status": "2121",
    //     "left_leg_status": "122121",
    //     "asymmetry_status": "21212",
    //     "bmdSections": {
    //         "apSpine": [
    //             {
    //                 "bmd": "1",
    //                 "region": "L1",
    //                 "tScore": "2",
    //                 "zScore": "3"
    //             },
    //             {
    //                 "bmd": "4",
    //                 "region": "L2",
    //                 "tScore": "5",
    //                 "zScore": "6"
    //             },
    //             {
    //                 "bmd": "7",
    //                 "region": "L3",
    //                 "tScore": "8",
    //                 "zScore": "9.5"
    //             },
    //             {
    //                 "bmd": "10",
    //                 "region": "L4",
    //                 "tScore": "11",
    //                 "zScore": "12"
    //             },
    //             {
    //                 "bmd": "13",
    //                 "region": "L1-L4",
    //                 "tScore": "14",
    //                 "zScore": "15"
    //             }
    //         ],
    //         "leftFemur": [
    //             {
    //                 "bmd": "",
    //                 "region": "NECK LEFT",
    //                 "tScore": "7",
    //                 "zScore": "9"
    //             },
    //             {
    //                 "bmd": "",
    //                 "region": "TOTAL LEFT",
    //                 "tScore": "",
    //                 "zScore": ""
    //             }
    //         ],
    //         "rightFemur": [
    //             {
    //                 "bmd": "1",
    //                 "region": "NECK RIGHT",
    //                 "tScore": "2",
    //                 "zScore": "3"
    //             },
    //             {
    //                 "bmd": "4",
    //                 "region": "TOTAL RIGHT",
    //                 "tScore": "5",
    //                 "zScore": "6"
    //             }
    //         ]
    //     },
    //     "bmdImages": {
    //         "apSpine": "https://vital-insights.s3.ap-south-1.amazonaws.com/dev/reports/dexa/photo_2025-05-28_11-13-27.jpg",
    //         "leftFemur": "https://vital-insights.s3.ap-south-1.amazonaws.com/dev/reports/dexa/photo_2025-05-28_11-13-26.jpg",
    //         "rightFemur": "https://vital-insights.s3.ap-south-1.amazonaws.com/dev/reports/dexa/photo_2025-05-28_11-13-26.jpg"
    //     },
    //     "report_status": "published",
    //     "id": 1,
    //     "appointment_id": 23,
    //     "sid_no": "000266",
    //     "patient_id": null,
    //     "branch_id": "02",
    //     "patient_name": null,
    //     "bone_density_rate": null,
    //     "fracture_risk": null,
    //     "body_fat_percentage_rate": null,
    //     "body_fat_percentage_rate_status": null,
    //     "visceral_fat_area_status": null,
    //     "andriod_gynoid_fat_status": "",
    //     "dexa_report_status": "",
    //     "body_fat_mass": "",
    //     "fat_area_vfa": "",
    //     "unhealth_fat": "",
    //     "z_score": "",
    //     "t_score": "",
    //     "fracture_risk_status": "",
    //     "almi_number": "",
    //     "ffmi_number": "",
    //     "muscle_loss_status": ""
    // }
    // Replace all placeholders with actual data
    const replacements = {
      '{{name}}': reportData.name || 'N/A',
      '{{height}}': reportData.height || 'N/A',
      '{{weight}}': reportData.weight || 'N/A',
      '{{age}}': reportData.age || 'N/A',
      '{{gender}}': reportData.gender || 'N/A',
      '{{dob}}': reportData.dob || 'N/A',
      '{{fat_mass}}': reportData.fat_mass || '--',
      '{{lean_mass}}': reportData.lean_mass || '--',
      '{{bmc}}': reportData.bmc || '--',
      '{{total_mass}}': reportData.total_mass || '--',
      '{{body_fat_percentage}}': reportData.body_fat_percentage || '--',
      '{{muscle_mass}}': reportData.muscle_mass || '--',
      '{{bone_density}}': reportData.bone_density || '--',
      '{{in_range}}': 'In Range',
      '{{suboptimal}}': 'Suboptimal',
      '{{needs_attention}}': 'Needs Attention',
      // BMD SECTIONS
      '{{bmdSections_apSpine_bmd_1}}': reportData.bmdSections.apSpine[0].bmd || '--',
      '{{bmdSections_apSpine_region_1}}': reportData.bmdSections.apSpine[0].region || '--',
      '{{bmdSections_apSpine_tScore_1}}': reportData.bmdSections.apSpine[0].tScore || '--',
      '{{bmdSections_apSpine_zScore_1}}': reportData.bmdSections.apSpine[0].zScore || '--',
      //
      '{{bmdSections_apSpine_bmd_2}}': reportData.bmdSections.apSpine[1].bmd || '--',
      '{{bmdSections_apSpine_region_2}}': reportData.bmdSections.apSpine[1].region || '--',
      '{{bmdSections_apSpine_tScore_2}}': reportData.bmdSections.apSpine[1].tScore || '--',
      '{{bmdSections_apSpine_zScore_2}}': reportData.bmdSections.apSpine[1].zScore || '--',
      //
      '{{bmdSections_apSpine_bmd_3}}': reportData.bmdSections.apSpine[2].bmd || '--',
      '{{bmdSections_apSpine_region_3}}': reportData.bmdSections.apSpine[2].region || '--',
      '{{bmdSections_apSpine_tScore_3}}': reportData.bmdSections.apSpine[2].tScore || '--',
      '{{bmdSections_apSpine_zScore_3}}': reportData.bmdSections.apSpine[2].zScore || '--',
      //
      '{{bmdSections_apSpine_bmd_4}}': reportData.bmdSections.apSpine[3].bmd || '--',
      '{{bmdSections_apSpine_region_4}}': reportData.bmdSections.apSpine[3].region || '--',
      '{{bmdSections_apSpine_tScore_4}}': reportData.bmdSections.apSpine[3].tScore || '--',
      '{{bmdSections_apSpine_zScore_4}}': reportData.bmdSections.apSpine[3].zScore || '--',
      //
      '{{bmdSections_apSpine_bmd_total}}': reportData.bmdSections.apSpine[4].bmd || '--',
      '{{bmdSections_apSpine_region_total}}': reportData.bmdSections.apSpine[4].region || '--',
      '{{bmdSections_apSpine_tScore_total}}': reportData.bmdSections.apSpine[4].tScore || '--',
      '{{bmdSections_apSpine_zScore_total}}': reportData.bmdSections.apSpine[4].zScore || '--',
      //
      '{{bmdSections_leftFemur_bmd_1}}': reportData.bmdSections.leftFemur[0].bmd || '--',
      '{{bmdSections_leftFemur_region_1}}': reportData.bmdSections.leftFemur[0].region || '--',
      '{{bmdSections_leftFemur_tScore_1}}': reportData.bmdSections.leftFemur[0].tScore || '--',
      '{{bmdSections_leftFemur_zScore_1}}': reportData.bmdSections.leftFemur[0].zScore || '--',
      //
      '{{bmdSections_leftFemur_bmd_total}}': reportData.bmdSections.leftFemur[1].bmd || '--',
      '{{bmdSections_leftFemur_region_total}}': reportData.bmdSections.leftFemur[1].region || '--',
      '{{bmdSections_leftFemur_tScore_total}}': reportData.bmdSections.leftFemur[1].tScore || '--',
      '{{bmdSections_leftFemur_zScore_total}}': reportData.bmdSections.leftFemur[1].zScore || '--',
      //
      '{{bmdSections_rightFemur_bmd_1}}': reportData.bmdSections.rightFemur[0].bmd || '--',
      '{{bmdSections_rightFemur_region_1}}': reportData.bmdSections.rightFemur[0].region || '--',
      '{{bmdSections_rightFemur_tScore_1}}': reportData.bmdSections.rightFemur[0].tScore || '--',
      '{{bmdSections_rightFemur_zScore_1}}': reportData.bmdSections.rightFemur[0].zScore || '--',
      //
      '{{bmdSections_rightFemur_bmd_total}}': reportData.bmdSections.rightFemur[1].bmd || '--',
      '{{bmdSections_rightFemur_region_total}}': reportData.bmdSections.rightFemur[1].region || '--',
      '{{bmdSections_rightFemur_tScore_total}}': reportData.bmdSections.rightFemur[1].tScore || '--',
      '{{bmdSections_rightFemur_zScore_total}}': reportData.bmdSections.rightFemur[1].zScore || '--',
      '{{visceral_fat_area}}': reportData.visceral_fat_area || '--',
      '{{visceral_fat}}': reportData.visceral_fat || '--',
      '{{andriod_gynoid_fat}}': reportData.andriod_gynoid_fat || '--',
      '{{body_composition_trunk}}': reportData.body_composition_trunk || '--',
      '{{almi_ffmi}}': reportData.almi_ffmi || '--',
      '{{right_arm_status}}': reportData.right_arm_status || '--',
      '{{left_arm_status}}': reportData.left_arm_status || '--',
      '{{right_leg_status}}': reportData.right_leg_status || '--',
      '{{left_leg_status}}': reportData.left_leg_status || '--',
      '{{asymmetry_status}}': reportData.asymmetry_status || '--',
      '{{bmdImages_apSpine}}': reportData.bmdImages.apSpine || '--',
      '{{bmdImages_leftFemur}}': reportData.bmdImages.leftFemur || '--',
      '{{bmdImages_rightFemur}}': reportData.bmdImages.rightFemur || '--',
    };

    // Replace all placeholders in the template
    Object.entries(replacements).forEach(([key, value]) => {
      template = template.replace(new RegExp(key, 'g'), value);
    });

    return template;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};