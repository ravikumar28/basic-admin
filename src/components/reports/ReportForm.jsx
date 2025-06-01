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
import { format } from 'date-fns';
import { uploadImageToS3 } from '../../utils/uploadImageToS3';
import { generateReportHTML } from '../../services/reportPreviewService';
import PreviewModal from '../common/PreviewModal';

// BMD Table section component
const regions = {
  apSpine: [
    { region: "L1" },
    { region: "L2" },
    { region: "L3" },
    { region: "L4" },
    { region: "L1-L4" },
  ],
  rightFemur: [
    { region: "NECK RIGHT" },
    { region: "TOTAL RIGHT" },
  ],
  leftFemur: [
    { region: "NECK LEFT" },
    { region: "TOTAL LEFT" },
  ],
};

const ImageUpload = ({ label, value, onChange, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleImageChange = async (e) => {
    if (disabled || uploading) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setUploading(true);
    try {
      setPreview(URL.createObjectURL(file));
      const s3Url = await uploadImageToS3(file);
      setPreview(s3Url);
      onChange(s3Url);
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (disabled || uploading) return;
    setPreview('');
    onChange('');
  };

  return (
    <div className="flex flex-col items-center mb-2">
      {preview ? (
        <img
          src={preview}
          alt={label}
          className="w-28 h-40 object-contain border rounded mb-1"
        />
      ) : (
        <div className="w-28 h-40 flex items-center justify-center border rounded bg-gray-100 text-gray-400 mb-1 text-xs">
          No Image
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={disabled || uploading}
        onChange={handleImageChange}
        className="block text-xs"
        style={{ width: "110px" }}
      />
      {uploading && <span className="text-xs text-primary-600 mt-1">Uploading...</span>}
      <span className="text-xs text-gray-500">{label}</span>
      {preview && !disabled && (
        <Button
          variant="secondary"
          className="mt-1"
          onClick={handleRemoveImage}
          disabled={uploading}
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};

const TableSection = ({
  title,
  sectionKey,
  data,
  onChange,
  imageUrl,
  onImageChange,
  disabled,
}) => (
  <div className="mb-6 flex gap-4 items-start">
    <ImageUpload
      label={title}
      value={imageUrl}
      onChange={img => onImageChange(sectionKey, img)}
      disabled={disabled}
    />
    <div className="flex-1 border rounded p-2">
      <div className="font-bold mb-2">{title}</div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">REGION</th>
            <th className="px-2 py-1 text-left">BMD (g/cm²)</th>
            <th className="px-2 py-1 text-left">T SCORE</th>
            <th className="px-2 py-1 text-left">Z SCORE</th>
          </tr>
        </thead>
        <tbody>
          {regions[sectionKey].map((row, idx) => (
            <tr key={row.region}>
              <td className="px-2 py-1">{row.region}</td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.001"
                  value={data[idx]?.bmd || ""}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "bmd", e.target.value)
                  }
                  className="input"
                  style={{ width: 140 }}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.1"
                  value={data[idx]?.tScore || ""}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "tScore", e.target.value)
                  }
                  className="input"
                  style={{ width: 120 }}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.1"
                  value={data[idx]?.zScore || ""}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "zScore", e.target.value)
                  }
                  className="input"
                  style={{ width: 120 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const BMDTableSection = ({
  bmdSections,
  bmdImages,
  onBmdChange,
  onBmdImageChange,
  isEditingAllowed,
}) => (
  <div>
    <TableSection
      title="AP: SPINE"
      sectionKey="apSpine"
      data={bmdSections.apSpine}
      onChange={onBmdChange}
      imageUrl={bmdImages.apSpine}
      onImageChange={onBmdImageChange}
      disabled={!isEditingAllowed}
    />
    <TableSection
      title="RIGHT FEMUR"
      sectionKey="rightFemur"
      data={bmdSections.rightFemur}
      onChange={onBmdChange}
      imageUrl={bmdImages.rightFemur}
      onImageChange={onBmdImageChange}
      disabled={!isEditingAllowed}
    />
    <TableSection
      title="LEFT FEMUR"
      sectionKey="leftFemur"
      data={bmdSections.leftFemur}
      onChange={onBmdChange}
      imageUrl={bmdImages.leftFemur}
      onImageChange={onBmdImageChange}
      disabled={!isEditingAllowed}
    />
  </div>
);

const ReportForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patient, setPatient] = useState(null);
  const [existingReport, setExistingReport] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);
  const [currentUser] = useState('ravikumar28');
  const [currentDateTime] = useState('2025-05-31 10:43:02');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const [formData, setFormData] = useState({
    visit_date: format(new Date(), 'yyyy-MM-dd'),
    name: null,
    height: null,
    weight: null,
    age: null,
    gender: null,
    dob: null,
    date_of_exam: format(new Date(), 'yyyy-MM-dd'),
    fat_mass: null,
    lean_mass: null,
    bmc: null,
    total_mass: null,
    body_fat_percentage: null,
    muscle_mass: null,
    bone_density: null,
    body_fat_status_color: null,
    zone_status: null,
    muscled_status: null,
    nutrished_status: null,
    suggestion_details: {
      training: null,
      nutrition: null
    },
    images: [
      { url: null, name: 'Asymmetry', type: 'asymmetry' },
      // { url: '', name: 'Trends', type: 'trend_graphs' }
    ],
    // bone_density_rate: '',
    // fracture_risk: '',
    // body_fat_percentage_rate: '',
    // body_fat_percentage_rate_status: '',
    visceral_fat_area: null,
    // visceral_fat_area_status: '',
    visceral_fat: null,
    andriod_gynoid_fat: null,
    // andriod_gynoid_fat_status: '',
    body_composition_trunk: null,
    almi_ffmi: null,
    right_arm_status: null,
    left_arm_status: null,
    right_leg_status: null,
    left_leg_status: null,
    asymmetry_status: null,
    // dexa_report_status: '',
    // body_fat_mass: '',
    // fat_area_vfa: '',
    // unhealth_fat: '',
    // z_score: '',
    // t_score: '',
    // fracture_risk_status: '',
    // almi_number: '',
    // ffmi_number: '',
    // muscle_loss_status: '',
    bmdSections: {
      apSpine: [
        { region: "L1", bmd: null, tScore: null, zScore: null },
        { region: "L2", bmd: null, tScore: null, zScore: null },
        { region: "L3", bmd: null, tScore: null, zScore: null },
        { region: "L4", bmd: null, tScore: null, zScore: null },
        { region: "L1-L4", bmd: null, tScore: null, zScore: null }
      ],
      rightFemur: [
        { region: "NECK RIGHT", bmd: null, tScore: null, zScore: null },
        { region: "TOTAL RIGHT", bmd: null, tScore: null, zScore: null }
      ],
      leftFemur: [
        { region: "NECK LEFT", bmd: null, tScore: null, zScore: null },
        { region: "TOTAL LEFT", bmd: null, tScore: null, zScore: null }
      ]
    },
    bmdImages: {
      apSpine: null,
      rightFemur: null,
      leftFemur: null
    },
    report_status: 'submitted'
  });

  const sections = [
    {
      id: 'patientInfo',
      label: 'Patient Information',
      fields: [
        { name: 'name', label: 'Name', type: 'input' },
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
        { name: 'body_fat_status_color', label: 'Body Fat Status Color', type: 'select', options: [
          { value: 'green', label: 'Green' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'red', label: 'Red' }
        ]}
      ]
    },
    {
      id: 'status',
      label: 'Status Assessment',
      fields: [
        { name: 'zone_status', label: 'Zone Status', type: 'input' },
        { name: 'muscled_status', label: 'Muscled Status', type: 'input' },
        { name: 'nutrished_status', label: 'Nourishment Status', type: 'input' },
        { name: 'suggestion_details.training', label: 'Training Advice', type: 'textarea' },
        { name: 'suggestion_details.nutrition', label: 'Nutrition Advice', type: 'textarea' }
        // { name: 'bone_density_rate', label: 'Bone Density Rate', type: 'input' },
        // { name: 'fracture_risk', label: 'Fracture Risk', type: 'input' },
        // { name: 'body_fat_percentage_rate', label: 'Body Fat Percentage Rate', type: 'input' },
        // { name: 'body_fat_percentage_rate_status', label: 'Body Fat Percentage Status', type: 'input' },
        // { name: 'images[1].url', label: 'Bone Density Image URL', type: 'image' }
      ]
    },
    {
      id: 'bmdTable',
      label: 'BMD Table',
      fields: []
    },
    {
      id: 'fatAnalysis',
      label: 'Fat Analysis',
      fields: [
        { name: 'visceral_fat_area', label: 'Visceral Fat Area', type: 'input' },
        // { name: 'visceral_fat_area_status', label: 'Visceral Fat Area Status', type: 'input' },
        { name: 'visceral_fat', label: 'Visceral Fat', type: 'input' },
        { name: 'andriod_gynoid_fat', label: 'Android/Gynoid Fat Ratio', type: 'input' }
        // { name: 'andriod_gynoid_fat_status', label: 'Android/Gynoid Fat Status', type: 'input' },
        // { name: 'images[2].url', label: 'Body Fat Distribution Image URL', type: 'image' },
        // { name: 'images[3].url', label: 'Visceral Fat Image URL', type: 'image' }
      ]
    },
    {
      id: 'asymmetry',
      label: 'Body Asymmetry',
      fields: [
        { name: 'body_composition_trunk', label: 'Body Composition Trunk', type: 'input' },
        { name: 'almi_ffmi', label: 'ALMI/FFMI', type: 'input' },
        { name: 'right_arm_status', label: 'Right Arm Status', type: 'input' },
        { name: 'left_arm_status', label: 'Left Arm Status', type: 'input' },
        { name: 'right_leg_status', label: 'Right Leg Status', type: 'input' },
        { name: 'left_leg_status', label: 'Left Leg Status', type: 'input' },
        { name: 'asymmetry_status', label: 'Asymmetry Status', type: 'input' },
        { name: 'images[0].url', label: 'Asymmetry Image URL', type: 'image' }
      ]
    }
    // {
    //   id: 'overallHealth',
    //   label: 'Overall Health',
    //   fields: [
    //     { name: 'dexa_report_status', label: 'DEXA Report Status', type: 'input' },
    //     { name: 'body_fat_mass', label: 'Body Fat Mass', type: 'input' },
    //     { name: 'fat_area_vfa', label: 'Fat Area VFA', type: 'input' },
    //     { name: 'unhealth_fat', label: 'Unhealthy Fat', type: 'input' },
    //     { name: 'z_score', label: 'Z-Score', type: 'input' },
    //     { name: 't_score', label: 'T-Score', type: 'input' },
    //     { name: 'fracture_risk_status', label: 'Fracture Risk Status', type: 'input' },
    //     { name: 'images[1].url', label: 'Trends Image URL', type: 'image' }
    //   ]
    // }
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
          if (patientResponse.data.data.dexaReport && patientResponse.data.data.dexaReport.report_status === 'published') {
            setIsEditingAllowed(false);
            toast.info("This report is marked as published. It can only be viewed but not edited.");
          } else {
            setIsEditingAllowed(true);
          }

          // Pre-populate patient data from appointment
          if (patientResponse.data.data.profile) {
            setFormData(prev => ({
              ...prev,
              name: patientResponse.data.data.profile.name,
              gender: patientResponse.data.data.profile.gender === 'male' ? 'Male' : 'Female',
              dob: patientResponse.data.data.profile.dob ? new Date(patientResponse.data.data.profile.dob).toISOString().split('T')[0] : '',
              age: patientResponse.data.data.profile.age || ''
            }));
          }
        }

        // Check if report already exists
        try {
          const reportResponse = await reportService.getReportByPatientId(patientId);
          console.log(reportResponse);
          if (reportResponse.data && reportResponse.data.success && reportResponse.data.data) {
            const reportData = reportResponse.data.data;
            setExistingReport(reportData);

            // Check if the report was created today
            // if (reportData.created_at) {
            //   const reportDate = reportData.created_at.split(' ')[0];
            //   const todayDate = new Date().toISOString().split('T')[0];
            //   setIsEditingAllowed(reportDate === todayDate);
            //   if (reportDate !== todayDate) {
            //     toast.info("This report is from a previous day. It can only be viewed but not edited.");
            //   }
            // }

            // Pre-fill form with existing data if available
            setFormData(prev => ({
              ...prev,
              ...reportData,
              suggestion_details: {
                training: reportData.suggestion_details?.training || '',
                nutrition: reportData.suggestion_details?.nutrition || ''
              },
              images: reportData.images && reportData.images.length > 0 ? reportData.images : prev.images,
              bmdSections: reportData.bmdSections || prev.bmdSections,
              bmdImages: reportData.bmdImages || prev.bmdImages,
            }));
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
    // eslint-disable-next-line
  }, [patientId]);

  const getNestedValue = (obj, path) => {
    if (!obj || !path) return '';
    
    return path.split('.').reduce((prev, curr) => {
      if (!prev) return '';
      
      if (curr.includes('[') && curr.includes(']')) {
        const arrayName = curr.split('[')[0];
        const index = parseInt(curr.split('[')[1].split(']')[0]);
        const prop = curr.split('.')[1];
        
        if (!prev[arrayName] || !prev[arrayName][index]) return '';
        return prop ? prev[arrayName][index][prop] : prev[arrayName][index];
      }
      
      return prev[curr];
    }, obj);
  };

  const setNestedValue = (obj, path, value) => {
    const result = { ...obj };

    if (path.includes('[') && path.includes(']')) {
      const [arrayPath, restPath] = path.split('.');
      const arrayName = arrayPath.split('[')[0];
      const index = parseInt(arrayPath.split('[')[1].split(']')[0]);

      if (restPath) {
        result[arrayName] = [...obj[arrayName]];
        result[arrayName][index] = {
          ...result[arrayName][index],
          [restPath]: value
        };
      } else {
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

  const handleFormChange = async (field, value) => {
    if (!isEditingAllowed) {
      return;
    }

    // Convert string values to numbers for number fields
    const numberFields = ['height', 'weight', 'age', 'fat_mass', 'lean_mass', 'total_mass', 'body_fat_percentage', 'muscle_mass', 'bone_density'];
    
    if (numberFields.includes(field)) {
      // Convert to number or null if empty
      const numberValue = value === '' ? null : Number(value);
      setFormData(prevData => setNestedValue(prevData, field, numberValue));
      return;
    }

    // 1. Image upload logic
    if (field.endsWith('.url') && typeof value === 'object' && value instanceof File) {
      try {
        const s3Url = await uploadImageToS3(value);
        setFormData(prevData => setNestedValue(prevData, field, s3Url));
        return;
      } catch (err) {
        toast.error('Failed to upload image');
        return;
      }
    }
  
    // 2. Body fat percentage calculation
    if (field === "fat_mass" || field === "total_mass") {
      setFormData(prevData => {
        let updatedData = setNestedValue(prevData, field, value);
  
        const fatMass = parseFloat(field === "fat_mass" ? value : updatedData.fat_mass);
        const totalMass = parseFloat(field === "total_mass" ? value : updatedData.total_mass);
        let bodyFatPercentage = "";
        if (totalMass > 0 && !isNaN(fatMass) && !isNaN(totalMass)) {
          bodyFatPercentage = ((fatMass / totalMass) * 100).toFixed(2);
        }
        updatedData = { ...updatedData, body_fat_percentage: bodyFatPercentage };
        return updatedData;
      });
      return;
    }
  
    // 3. Generic fallback
    setFormData(prevData => setNestedValue(prevData, field, value));
  };

  const handleBmdChange = (section, idx, field, value) => {
    setFormData(prev =>
      ({
        ...prev,
        bmdSections: {
          ...prev.bmdSections,
          [section]: prev.bmdSections[section].map((row, i) =>
            i === idx ? { ...row, [field]: value } : row
          ),
        },
      })
    );
  };

  const handleBmdImageChange = async (sectionKey, imgOrFile) => {
    // If a File, upload to S3
    if (imgOrFile instanceof File) {
      try {
        const s3Url = await uploadImageToS3(imgOrFile);
        setFormData(prev => ({
          ...prev,
          bmdImages: { ...prev.bmdImages, [sectionKey]: s3Url }
        }));
      } catch (err) {
        toast.error('Failed to upload image');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        bmdImages: { ...prev.bmdImages, [sectionKey]: imgOrFile }
      }));
    }
  };

  const handleSubmit = async (status = 'submitted') => {
    if (!isEditingAllowed) {
      toast.error('This report cannot be edited as it was not created today');
      return;
    }

    setSubmitting(true);

    try {
      const reportData = {
        ...formData,
        appointment_id: parseInt(patientId),
        created_by: currentUser,
        updated_by: currentUser,
        report_status: status
      };

      if (existingReport) {
        await reportService.createReport(patientId, reportData);
        toast.success(status === 'published' ? 'Report published successfully' : 'Report updated successfully');
      } else {
        await reportService.createReport(patientId, reportData);
        toast.success(status === 'published' ? 'Report published successfully' : 'Report created successfully');
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

  const handlePreview = async () => {
    try {
      const reportData = {
        patientName: patient?.profile?.name,
        height: patient?.profile?.height,
        weight: patient?.profile?.weight,
        age: patient?.profile?.age,
        gender: patient?.profile?.gender,
        dob: patient?.profile?.dob,
        ...formData
      };

      const html = await generateReportHTML(reportData);
      setPreviewHtml(html);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    }
  };

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
            onChange={async (val) => {
              // If val is a File, upload to S3 first.
              if (val && typeof val === 'object' && val instanceof File) {
                await handleFormChange(field.name, val);
              } else {
                handleFormChange(field.name, val);
              }
            }}
            disabled={!isEditingAllowed}
            uploadImageToS3={uploadImageToS3}
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
              {sections[currentSection].id === 'bmdTable'
                ? <BMDTableSection
                    bmdSections={formData.bmdSections}
                    bmdImages={formData.bmdImages}
                    onBmdChange={handleBmdChange}
                    onBmdImageChange={handleBmdImageChange}
                    isEditingAllowed={isEditingAllowed}
                  />
                : sections[currentSection].fields.map(field => renderField(field))}
            </div>
          </FormSection>

          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              onClick={currentSection > 0 ? goToPreviousSection : handleCancel}
            >
              {currentSection > 0 ? 'Previous' : 'Back to List'}
            </Button>

            {currentSection === sections.length - 1 ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePreview}
                  disabled={submitting}
                >
                  Preview Report
                </Button>
                <Button 
                  onClick={() => handleSubmit('submitted')} 
                  disabled={submitting}
                  variant="secondary"
                >
                  {submitting ? 'Saving...' : 'Submit Report'}
                </Button>
                <Button 
                  onClick={() => handleSubmit('published')} 
                  disabled={submitting}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  {submitting ? 'Publishing...' : 'Submit & Publish'}
                </Button>
              </div>
            ) : (
              <Button onClick={goToNextSection}>Next</Button>
            )}
          </div>
        </Card>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        htmlContent={previewHtml}
      />
    </div>
  );
};

export default ReportForm;