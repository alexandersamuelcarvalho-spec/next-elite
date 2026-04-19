'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import { ScrollWithArrow } from '../../components/UIComponents';

export default function FindMyTeamPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetch('/api/sheets?type=locations').then(r => r.json()).then(d => setLocations(Array.isArray(d) ? d : [])).catch(() => setLocations([]));
    fetch('/api/sheets?type=leagues').then(r => r.json()).then(d => setLeagues(Array.isArray(d) ? d : [])).catch(() => setLeagues([]));
    fetch('/api/sheets?type=teams').then(r => r.json()).then(d => setTeams(Array.isArray(d) ? d : [])).catch(() => setTeams([]));
  }, []);

  const filteredLeagues = leagues.filter(l => !selectedLocation || l.location === selectedLocation);
  const filteredTeams = teams.filter(t => !selectedLeague || (t.leagues || []).includes(selectedLeague));

  const handleGoTeam = () => {
    if (selectedTeam) {
      router.push(`/team/${encodeURIComponent(selectedTeam)}`);
    }
  };

  const handleGoLeague = () => {
    if (selectedLeague) {
      router.push(`/league/${encodeURIComponent(selectedLeague)}`);
    }
  };

  const handleGoLocation = () => {
    if (selectedLocation) {
      router.push(`/location/${encodeURIComponent(selectedLocation)}`);
    }
  };

  return (
    <PageLayout>
      <div style={{ paddingTop: 16 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'Copperplate, "Copperplate Gothic Light", Cinzel, serif',
          textTransform: 'uppercase',
        }}>
          FIND MY TEAM
        </div>

        {/* Location */}
        <div style={{ marginBottom: 16 }}>
          <ScrollWithArrow
            value={selectedLocation}
            options={locations.map(l => ({ value: l, label: l }))}
            onChange={setSelectedLocation}
            onArrow={handleGoLocation}
            label="(LOCATION)"
          />
        </div>

        {/* League */}
        <div style={{ marginBottom: 16 }}>
          <ScrollWithArrow
            value={selectedLeague}
            options={filteredLeagues.map(l => ({ value: l.name, label: l.name }))}
            onChange={setSelectedLeague}
            onArrow={handleGoLeague}
            label="(LEAGUE)"
          />
        </div>

        {/* Team */}
        <div style={{ marginBottom: 16 }}>
          <ScrollWithArrow
            value={selectedTeam}
            options={filteredTeams.map(t => ({ value: t.name, label: t.name }))}
            onChange={setSelectedTeam}
            onArrow={handleGoTeam}
            label="(TEAM)"
          />
        </div>
      </div>
    </PageLayout>
  );
}
