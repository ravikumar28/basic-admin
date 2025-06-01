import React from "react";

// Reusable image upload for each section
const ImageUpload = ({ label, value, onChange, disabled }) => (
  <div className="flex flex-col items-center mb-2">
    {value ? (
      <img
        src={value}
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
      disabled={disabled}
      onChange={e => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = ev => onChange(ev.target.result);
          reader.readAsDataURL(e.target.files[0]);
        }
      }}
      className="block text-xs"
      style={{ width: "110px" }}
    />
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

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
          {data.map((row, idx) => (
            <tr key={row.region}>
              <td className="px-2 py-1">{row.region}</td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.001"
                  value={row.bmd}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "bmd", e.target.value)
                  }
                  className="input"
                  style={{ width: 100 }}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.1"
                  value={row.tScore}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "tScore", e.target.value)
                  }
                  className="input"
                  style={{ width: 80 }}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  step="0.1"
                  value={row.zScore}
                  disabled={disabled}
                  onChange={e =>
                    onChange(sectionKey, idx, "zScore", e.target.value)
                  }
                  className="input"
                  style={{ width: 80 }}
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

export default BMDTableSection;