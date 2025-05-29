import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../common/Card';
import Button from '../common/Button';
import FormSidebar from './FormSidebar';
import FormSection from './FormSection';
import TextInputSection from './TextInputSection';
import ImageUploadSection from './ImageUploadSection';
import Spinner from '../common/Spinner';
import { reportService } from '../../services/reportService';
import { patientService } from '../../services/patientService';
import Input from '../common/Input';
import Select from '../common/Select';
import { format, isToday, parseISO } from 'date-fns';

const ReportForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patient, setPatient] = useState(null);
  const [existingReport, setExistingReport] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);
  const [currentUser] = useState('ravikumar28'); // Current user's login
  const [currentDateTime] = useState('2025-05-29 13:55:08'); // Current UTC time
  
  const [formData, setFormData] = useState({
    visit_date: format(new Date(), 'yyyy-MM-dd'),
    height: '',
    weight: '',
    age: '',
    gender: '',
    dob: '',
    date_of_exam: format(new Date(), 'yyyy-MM-dd'),
    fat_mass: '',
    lean_mass: '',
    bmc: '',
    total_mass: '',
    body_fat_percentage: '',
    muscle_mass: '',
    bone_density: '',
    muscled_status: '',
    nutrished_status: '',
    advice_details: {
      training: '',
      nutrition: ''
    },
    images: [
      {
        url: '',
        name: 'Body Composition',
        type: 'body_composition'
      },
      {
        url: '',
        name: 'Bone Density',
        type: 'bone_density'
      },
      {
        url: '',
        name: 'Body Fat Distribution',
        type: 'body_fat_distribution'
      },
      {
        url: '',
        name: 'Visceral Fat',
        type: 'visceral_fat'
      },
      {
        url: '',
        name: 'Asymmetry',
        type: 'asymmetry'
      },
      {
        url: '',
        name: 'Trends',
        type: 'trend_graphs'
      }
    ],
    bone_density_rate: '',
    fracture_risk: '',
    body_fat_percentage_rate: '',
    body_fat_percentage_rate_status: '',
    visceral_fat_area: '',
    visceral_fat_area_status: '',
    visceral_fat: '',
    andriod_gynoid_fat: '',
    andriod_gynoid_fat_status: '',
    body_composition_trunk: '',
    almi_ffmi: '',
    right_arm_status: '',
    left_arm_status: '',
    right_leg_status: '',
    left_leg_status: '',
    asymmetry_status: '',
    dexa_report_status: '',
    body_fat_mass: '',
    fat_area_vfa: '',
    unhealth_fat: '',
    z_score: '',
    t_score: '',
    fracture_risk_status: '',
    almi_number: '',
    ffmi_number: '',
    muscle_loss_status: ''
  });

  const sections = [
    { 
      id: 'patientInfo', 
      label: 'Patient Information',
      fields: [
        { name: 'height', label: 'Height (cm)', type: 'input', inputType: 'number' },
        { name: 'weight', label: 'Weight (kg)', type: 'input', inputType: 'number' },
        { name: 'age', label: 'Age (years)', type: 'input', inputType: 'number' },
        { name: 'gender', label: 'Gender', type: 'select', options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ]},
        { name: 'dob', label: 'Date of Birth', type: 'input', inputType: 'date' },
        { name: 'date_of_exam', label: 'Date of Examination', type: 'input', inputType: 'date' }
      ]
    },
    { 
      id: 'bodyComposition', 
      label: 'Body Composition',
      fields: [
        { name: 'fat_mass', label: 'Fat Mass (kg)', type: 'input', inputType: 'number' },
        { name: 'lean_mass', label: 'Lean Mass (kg)', type: 'input', inputType: 'number' },
        { name: 'bmc', label: 'BMC', type: 'input', inputType: 'number' },
        { name: 'total_mass', label: 'Total Mass (kg)', type: 'input', inputType: 'number' },
        { name: 'body_fat_percentage', label: 'Body Fat Percentage (%)', type: 'input', inputType: 'number' },
        { name: 'muscle_mass', label: 'Muscle Mass (kg)', type: 'input', inputType: 'number' },
        { name: 'bone_density', label: 'Bone Density', type: 'input', inputType: 'number' },
        { name: 'images[0].url', label: 'Body Composition Image URL', type: 'image' }
      ]
    },
    { 
      id: 'status', 
      label: 'Status Assessment',
      fields: [
        { name: 'muscled_status', label: 'Muscled Status', type: 'input' },
        { name: 'nutrished_status', label: 'Nourishment Status', type: 'input' },
        { name: 'bone_density_rate', label: 'Bone Density Rate', type: 'input' },
        { name: 'fracture_risk', label: 'Fracture Risk', type: 'input' },
        { name: 'body_fat_percentage_rate', label: 'Body Fat Percentage Rate', type: 'input' },
        { name: 'body_fat_percentage_rate_status', label: 'Body Fat Percentage Status', type: 'input' },
        { name: 'images[1].url', label: 'Bone Density Image URL', type: 'image' }
      ]
    },
    { 
      id: 'fatAnalysis', 
      label: 'Fat Analysis',
      fields: [
        { name: 'visceral_fat_area', label: 'Visceral Fat Area', type: 'input' },
        { name: 'visceral_fat_area_status', label: 'Visceral Fat Area Status', type: 'input' },
        { name: 'visceral_fat', label: 'Visceral Fat', type: 'input' },
        { name: 'andriod_gynoid_fat', label: 'Android/Gynoid Fat Ratio', type: 'input' },
        { name: 'andriod_gynoid_fat_status', label: 'Android/Gynoid Fat Status', type: 'input' },
        { name: 'body_composition_trunk', label: 'Body Composition Trunk', type: 'input' },
        { name: 'images[2].url', label: 'Body Fat Distribution Image URL', type: 'image' },
        { name: 'images[3].url', label: 'Visceral Fat Image URL', type: 'image' }
      ]
    },
    { 
      id: 'asymmetry', 
      label: 'Body Asymmetry',
      fields: [
        { name: 'right_arm_status', label: 'Right Arm Status', type: 'input' },
        { name: 'left_arm_status', label: 'Left Arm Status', type: 'input' },
        { name: 'right_leg_status', label: 'Right Leg Status', type: 'input' },
        { name: 'left_leg_status', label: 'Left Leg Status', type: 'input' },
        { name: 'asymmetry_status', label: 'Asymmetry Status', type: 'input' },
        { name: 'images[4].url', label: 'Asymmetry Image URL', type: 'image' }
      ]
    },
    { 
      id: 'overallHealth', 
      label: 'Overall Health',
      fields: [
        { name: 'dexa_report_status', label: 'DEXA Report Status', type: 'input' },
        { name: 'body_fat_mass', label: 'Body Fat Mass', type: 'input' },
        { name: 'fat_area_vfa', label: 'Fat Area VFA', type: 'input' },
        { name: 'unhealth_fat', label: 'Unhealthy Fat', type: 'input' },
        { name: 'z_score', label: 'Z-Score', type: 'input' },
        { name: 't_score', label: 'T-Score', type: 'input' },
        { name: 'fracture_risk_status', label: 'Fracture Risk Status', type: 'input' },
        { name: 'images[5].url', label: 'Trends Image URL', type: 'image' }
      ]
    },
    { 
      id: 'advice', 
      label: 'Advice & Recommendations',
      fields: [
        { name: 'almi_number', label: 'ALMI Number', type: 'input' },
        { name: 'ffmi_number', label: 'FFMI Number', type: 'input' },
        { name: 'muscle_loss_status', label: 'Muscle Loss Status', type: 'input' },
        { name: 'advice_details.training', label: 'Training Advice', type: 'textarea' },
        { name: 'advice_details.nutrition', label: 'Nutrition Advice', type: 'textarea' }
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patient data
        const patientResponse = await patientService.getPatientById(patientId);
        if (patientResponse.data && patientResponse.data.success) {
          setPatient(patientResponse.data.data);

          // Check if this is today's appointment to determine if editing is allowed
          if (patientResponse.data.data.slot_start_time) {
            const appointmentDate = new Date(patientResponse.data.data.slot_start_time).toISOString().split('T')[0];
            const todayDate = new Date().toISOString().split('T')[0];
            
            // Only allow editing if appointment is today
            setIsEditingAllowed(appointmentDate === todayDate);
            
            if (appointmentDate !== todayDate) {
              toast.info("This appointment is not from today. The report can only be viewed but not edited.");
            }
          }

          // Pre-populate patient data from appointment
          if (patientResponse.data.data.profile) {
            setFormData(prev => ({
              ...prev,
              gender: patientResponse.data.data.profile.gender === 'male' ? 'Male' : 'Female',
              dob: patientResponse.data.data.profile.dob ? new Date(patientResponse.data.data.profile.dob).toISOString().split('T')[0] : '',
              age: patientResponse.data.data.profile.age || ''
            }));
          }
        }
        
        // Check if report already exists
        try {
          const reportResponse = await reportService.getReportByPatientId(patientId);
          if (reportResponse.data && reportResponse.data.success && reportResponse.data.data) {
            const reportData = reportResponse.data.data;
            setExistingReport(reportData);
            
            // Check if the report was created today
            if (reportData.created_at) {
              const reportDate = reportData.created_at.split(' ')[0];
              const todayDate = new Date().toISOString().split('T')[0];
              setIsEditingAllowed(reportDate === todayDate);
              
              if (reportDate !== todayDate) {
                toast.info("This report is from a previous day. It can only be viewed but not edited.");
              }
            }
            
            // Pre-fill form with existing data if available
            setFormData({
              visit_date: reportData.visit_date || '',
              height: reportData.height || '',
              weight: reportData.weight || '',
              age: reportData.age || '',
              gender: reportData.gender || '',
              dob: reportData.dob || '',
              date_of_exam: reportData.date_of_exam || '',
              fat_mass: reportData.fat_mass || '',
              lean_mass: reportData.lean_mass || '',
              bmc: reportData.bmc || '',
              total_mass: reportData.total_mass || '',
              body_fat_percentage: reportData.body_fat_percentage || '',
              muscle_mass: reportData.muscle_mass || '',
              bone_density: reportData.bone_density || '',
              muscled_status: reportData.muscled_status || '',
              nutrished_status: reportData.nutrished_status || '',
              advice_details: {
                training: reportData.advice_details?.training || '',
                nutrition: reportData.advice_details?.nutrition || ''
              },
              images: reportData.images && reportData.images.length > 0 ? reportData.images : [
                { url: '', name: 'Body Composition', type: 'body_composition' },
                { url: '', name: 'Bone Density', type: 'bone_density' },
                { url: '', name: 'Body Fat Distribution', type: 'body_fat_distribution' },
                { url: '', name: 'Visceral Fat', type: 'visceral_fat' },
                { url: '', name: 'Asymmetry', type: 'asymmetry' },
                { url: '', name: 'Trends', type: 'trend_graphs' }
              ],
              bone_density_rate: reportData.bone_density_rate || '',
              fracture_risk: reportData.fracture_risk || '',
              body_fat_percentage_rate: reportData.body_fat_percentage_rate || '',
              body_fat_percentage_rate_status: reportData.body_fat_percentage_rate_status || '',
              visceral_fat_area: reportData.visceral_fat_area || '',
              visceral_fat_area_status: reportData.visceral_fat_area_status || '',
              visceral_fat: reportData.visceral_fat || '',
              andriod_gynoid_fat: reportData.andriod_gynoid_fat || '',
              andriod_gynoid_fat_status: reportData.andriod_gynoid_fat_status || '',
              body_composition_trunk: reportData.body_composition_trunk || '',
              almi_ffmi: reportData.almi_ffmi || '',
              right_arm_status: reportData.right_arm_status || '',
              left_arm_status: reportData.left_arm_status || '',
              right_leg_status: reportData.right_leg_status || '',
              left_leg_status: reportData.left_leg_status || '',
              asymmetry_status: reportData.asymmetry_status || '',
              dexa_report_status: reportData.dexa_report_status || '',
              body_fat_mass: reportData.body_fat_mass || '',
              fat_area_vfa: reportData.fat_area_vfa || '',
              unhealth_fat: reportData.unhealth_fat || '',
              z_score: reportData.z_score || '',
              t_score: reportData.t_score || '',
              fracture_risk_status: reportData.fracture_risk_status || '',
              almi_number: reportData.almi_number || '',
              ffmi_number: reportData.ffmi_number || '',
              muscle_loss_status: reportData.muscle_loss_status || ''
            });
          }
        } catch (error) {
          // No report exists, continue with empty form (we're creating a new report)
          if (error.response && error.response.status !== 404) {
            throw error;
          }
        }
      } catch (error) {
        toast.error('Failed to load patient data');
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
      if (curr.includes('[') && curr.includes(']')) {
        const arrayName = curr.split('[')[0];
        const index = parseInt(curr.split('[')[1].split(']')[0]);
        const prop = curr.split('.')[1];
        
        return prev[arrayName][index][prop];
      }
      return prev ? prev[curr] : undefined;
    }, obj);
  };

  const setNestedValue = (obj, path, value) => {
    const result = { ...obj };
    
    if (path.includes('[') && path.includes(']')) {
      const [arrayPath, restPath] = path.split('.');
      const arrayName = arrayPath.split('[')[0];
      const index = parseInt(arrayPath.split('[')[1].split(']')[0]);
      
      if (restPath) {
        // This is for nested properties like images[0].url
        result[arrayName] = [...obj[arrayName]];
        result[arrayName][index] = {
          ...result[arrayName][index],
          [restPath]: value
        };
      } else {
        // This is for direct array values like permissions[0]
        result[arrayName] = [...obj[arrayName]];
        result[arrayName][index] = value;
      }
      
      return result;
    }
    
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      result[parent] = { ...obj[parent], [child]: value };
      return result;
    }
    
    return { ...obj, [path]: value };
  };
  
  // Updates nested object values in form
  const handleFormChange = (field, value) => {
    if (!isEditingAllowed) {
      return; // Prevent editing if not allowed
    }

    setFormData(prevData => setNestedValue(prevData, field, value));
  };

  const handleSubmit = async () => {
    if (!isEditingAllowed) {
      toast.error('This report cannot be edited as it was not created today');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare the data for submission
      const reportData = {
        appointment_id: parseInt(patientId),
        visit_date: formData.visit_date,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        dob: formData.dob,
        date_of_exam: formData.date_of_exam,
        fat_mass: parseFloat(formData.fat_mass) || 0,
        lean_mass: parseFloat(formData.lean_mass) || 0,
        bmc: parseFloat(formData.bmc) || 0,
        total_mass: parseFloat(formData.total_mass) || 0,
        body_fat_percentage: parseFloat(formData.body_fat_percentage) || 0,
        muscle_mass: parseFloat(formData.muscle_mass) || 0,
        bone_density: parseFloat(formData.bone_density) || 0,
        muscled_status: formData.muscled_status,
        nutrished_status: formData.nutrished_status,
        advice_details: formData.advice_details,
        images: formData.images,
        bone_density_rate: formData.bone_density_rate,
        fracture_risk: formData.fracture_risk,
        body_fat_percentage_rate: formData.body_fat_percentage_rate,
        body_fat_percentage_rate_status: formData.body_fat_percentage_rate_status,
        visceral_fat_area: formData.visceral_fat_area,
        visceral_fat_area_status: formData.visceral_fat_area_status,
        visceral_fat: formData.visceral_fat,
        andriod_gynoid_fat: formData.andriod_gynoid_fat,
        andriod_gynoid_fat_status: formData.andriod_gynoid_fat_status,
        body_composition_trunk: formData.body_composition_trunk,
        almi_ffmi: formData.almi_ffmi,
        right_arm_status: formData.right_arm_status,
        left_arm_status: formData.left_arm_status,
        right_leg_status: formData.right_leg_status,
        left_leg_status: formData.left_leg_status,
        asymmetry_status: formData.asymmetry_status,
        dexa_report_status: formData.dexa_report_status,
        body_fat_mass: formData.body_fat_mass,
        fat_area_vfa: formData.fat_area_vfa,
        unhealth_fat: formData.unhealth_fat,
        z_score: formData.z_score,
        t_score: formData.t_score,
        fracture_risk_status: formData.fracture_risk_status,
        almi_number: formData.almi_number,
        ffmi_number: formData.ffmi_number,
        muscle_loss_status: formData.muscle_loss_status,
        created_by: currentUser,
        updated_by: currentUser
      };
      
      if (existingReport) {
        await reportService.updateReport(existingReport.id, reportData);
        toast.success('Report updated successfully');
      } else {
        await reportService.createReport(patientId, reportData);
        toast.success('Report created successfully');
      }
      
      navigate('/patients');
    } catch (error) {
      toast.error('Failed to save report');
      console.error('Error saving report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  const handleSectionChange = (index) => {
    setCurrentSection(index);
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Render form field based on its type
  const renderField = (field) => {
    const fieldValue = getNestedValue(formData, field.name);
      
    switch (field.type) {
      case 'input':
        return (
          <Input
            key={field.name}
            label={field.label}
            id={field.name}
            name={field.name}
            type={field.inputType || 'text'}
            value={fieldValue || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            className="mb-4"
            disabled={!isEditingAllowed}
          />
        );
        
      case 'textarea':
        return (
          <TextInputSection
            key={field.name}
            label={field.label}
            value={fieldValue || ''}
            onChange={(value) => handleFormChange(field.name, value)}
            disabled={!isEditingAllowed}
          />
        );
        
      case 'image':
        return (
          <ImageUploadSection
            key={field.name}
            label={field.label}
            value={fieldValue || ''}
            onChange={(value) => handleFormChange(field.name, value)}
            disabled={!isEditingAllowed}
          />
        );
        
      case 'select':
        return (
          <Select
            key={field.name}
            label={field.label}
            id={field.name}
            name={field.name}
            value={fieldValue || ''}
            options={field.options || []}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            className="mb-4"
            disabled={!isEditingAllowed}
          />
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64">
        <FormSidebar 
          sections={sections}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          patient={patient}
          existingReport={existingReport}
          isEditingAllowed={isEditingAllowed}
          currentDateTime={currentDateTime}
        />
      </div>
      
      <div className="flex-1">
        <Card>
        {!isEditingAllowed && (
          <div className="mb-4 p-3 bg-primary-50 border-l-4 border-primary-500 text-primary-800">
            <p className="font-medium">View Only Mode</p>
            <p className="text-sm">
              This report can no longer be edited as the appointment is not for today.
            </p>
          </div>
        )}
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {sections[currentSection].label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditingAllowed 
                ? "Complete all fields in this section before proceeding"
                : "View the information in this section"}
            </p>
          </div>
          
          <FormSection>
            <div className="space-y-6">
              {sections[currentSection].fields.map(field => renderField(field))}
            </div>
          </FormSection>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="secondary" 
              onClick={currentSection > 0 ? goToPreviousSection : handleCancel}
            >
              {currentSection > 0 ? 'Previous' : 'Back to List'}
            </Button>
            
            {currentSection < sections.length - 1 ? (
              <Button onClick={goToNextSection}>Next</Button>
            ) : (
              isEditingAllowed ? (
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Submit Report'}
                </Button>
              ) : (
                <Button onClick={handleCancel}>
                  Close
                </Button>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;