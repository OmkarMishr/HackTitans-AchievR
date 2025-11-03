import { useState } from 'react';

const SKILLS_CATALOG = {
  technicalSkills: [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB',
    'SQL', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL', 'Machine Learning',
    'Data Analysis', 'DevOps', 'Java', 'C++', 'Go', 'Kubernetes', 'PostgreSQL',
    'Redis', 'Firebase', 'Next.js', 'Vue.js', 'Angular'
  ],
  softSkills: [
    'Leadership', 'Teamwork', 'Communication', 'Problem Solving',
    'Time Management', 'Project Management', 'Presentation Skills',
    'Decision Making', 'Adaptability', 'Creativity', 'Critical Thinking',
    'Mentoring', 'Conflict Resolution', 'Negotiation', 'Public Speaking'
  ],
  tools: [
    'Git/GitHub', 'VS Code', 'Postman', 'Docker', 'Jenkins', 'Figma',
    'Jira', 'Slack', 'AWS', 'Google Cloud', 'Azure', 'Webpack',
    'Babel', 'NPM', 'Linux', 'MySQL Workbench', 'MongoDB Atlas',
    'Firebase Console', 'Vercel', 'Heroku', 'DataGrip'
  ]
};

export default function SkillSelector({ selectedSkills, setSelectedSkills }) {
  const toggleSkill = (skillType, skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillType]: prev[skillType].includes(skill)
        ? prev[skillType].filter(s => s !== skill)
        : [...prev[skillType], skill]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Technical Skills */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-blue-700">💻 Technical Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SKILLS_CATALOG.technicalSkills.map(skill => (
            <label key={skill} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={selectedSkills.technicalSkills.includes(skill)}
                onChange={() => toggleSkill('technicalSkills', skill)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-purple-700">🎯 Soft Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SKILLS_CATALOG.softSkills.map(skill => (
            <label key={skill} className="flex items-center p-3 border rounded-lg hover:bg-purple-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={selectedSkills.softSkills.includes(skill)}
                onChange={() => toggleSkill('softSkills', skill)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="ml-2 text-gray-700">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-orange-700">🛠️ Tools & Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SKILLS_CATALOG.tools.map(tool => (
            <label key={tool} className="flex items-center p-3 border rounded-lg hover:bg-orange-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={selectedSkills.tools.includes(tool)}
                onChange={() => toggleSkill('tools', tool)}
                className="w-4 h-4 text-orange-600"
              />
              <span className="ml-2 text-gray-700">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(selectedSkills.technicalSkills.length > 0 || selectedSkills.softSkills.length > 0 || selectedSkills.tools.length > 0) && (
        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <h4 className="font-bold mb-3">✅ Selected Skills ({selectedSkills.technicalSkills.length + selectedSkills.softSkills.length + selectedSkills.tools.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.technicalSkills.map(skill => (
              <span key={skill} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
            {selectedSkills.softSkills.map(skill => (
              <span key={skill} className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
            {selectedSkills.tools.map(tool => (
              <span key={tool} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}