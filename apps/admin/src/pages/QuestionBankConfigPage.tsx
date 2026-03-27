import { useMemo, useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';
type AgeBand = '3-5' | '6-8' | '9-12' | '13+';

interface QuestionRow {
  id: string;
  topic: string;
  difficulty: Difficulty;
  age_band: AgeBand;
  published: boolean;
}

const MOCK_ROWS: QuestionRow[] = [
  { id: 'q-flash-001', topic: '形态识别', difficulty: 'easy', age_band: '6-8', published: false },
  { id: 'q-identify-014', topic: '生态位', difficulty: 'medium', age_band: '9-12', published: false }
];

export default function QuestionBankConfigPage() {
  const [topic, setTopic] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');
  const [ageBand, setAgeBand] = useState<'all' | AgeBand>('all');
  const [rows, setRows] = useState(MOCK_ROWS);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const topicMatched = topic === 'all' || row.topic === topic;
      const difficultyMatched = difficulty === 'all' || row.difficulty === difficulty;
      const ageMatched = ageBand === 'all' || row.age_band === ageBand;
      return topicMatched && difficultyMatched && ageMatched;
    });
  }, [rows, topic, difficulty, ageBand]);

  function publishAllFiltered() {
    setRows((prev) =>
      prev.map((row) =>
        filteredRows.some((filtered) => filtered.id === row.id)
          ? { ...row, published: true }
          : row
      )
    );
  }

  return (
    <section>
      <h1>题库配置</h1>
      <div>
        <label>
          主题
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">全部</option>
            <option value="形态识别">形态识别</option>
            <option value="生态位">生态位</option>
          </select>
        </label>
        <label>
          难度
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'all' | Difficulty)}>
            <option value="all">全部</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </label>
        <label>
          年龄段
          <select value={ageBand} onChange={(e) => setAgeBand(e.target.value as 'all' | AgeBand)}>
            <option value="all">全部</option>
            <option value="3-5">3-5</option>
            <option value="6-8">6-8</option>
            <option value="9-12">9-12</option>
            <option value="13+">13+</option>
          </select>
        </label>
        <button type="button" onClick={publishAllFiltered}>批量发布当前筛选结果</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>题目 ID</th>
            <th>主题</th>
            <th>难度</th>
            <th>年龄段</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.topic}</td>
              <td>{row.difficulty}</td>
              <td>{row.age_band}</td>
              <td>{row.published ? '已发布' : '未发布'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
