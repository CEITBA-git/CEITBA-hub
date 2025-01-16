'use client'

import { useState } from 'react';
import Image from 'next/image';
import staffData from '@/data/staff.json';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';

// Combine directivos and departamentos for the complete list
const staffMembers = [...staffData.directivos, ...staffData.departamentos];

export default function StaffPage() {
  const [activeTab] = useState('staff');

  return (
    <Layout activeTab={activeTab}>
      <section className="space-y-12">
        {/* Directivos */}
        <div className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-8">
          <SectionTitle>Directivos</SectionTitle>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {staffMembers
              .filter(member => member.department === 'Directivo')
              .map((member, index) => (
                <div 
                  key={index}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface">
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        className="object-cover"
                        fill
                        sizes="(max-width: 96px) 96px"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-primary font-medium mb-1">{member.role}</p>
                      <a href={`mailto:${member.email}`} className="text-gray text-sm hover:text-primary transition-colors">
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Departamentos */}
        {['IT', 'Media', 'Infraestructura y Proyectos', 'Deportes', 'Náutica'].map(dept => {
          const departmentMembers = staffMembers.filter(member => member.department === dept);
          if (departmentMembers.length === 0) return null;

          return (
            <div key={dept} className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-8">
              <SectionTitle>{dept}</SectionTitle>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {departmentMembers.map((member, index) => (
                  <div 
                    key={index}
                    className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-black/[.08] dark:border-white/[.145] hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface">
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          className="object-cover"
                          fill
                          sizes="(max-width: 64px) 64px"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-primary text-sm font-medium mb-1">{member.role}</p>
                        <a href={`mailto:${member.email}`} className="text-gray text-sm hover:text-primary transition-colors">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </Layout>
  );
} 