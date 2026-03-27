import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { RecognitionResult } from '../../../../packages/shared-types/src';

interface Props {
  result: RecognitionResult;
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>{title}</Text>
      {items.length === 0 ? (
        <Text style={{ opacity: 0.8 }}>暂无内容</Text>
      ) : (
        items.map((item, index) => (
          <Text key={`${title}-${index}`} style={{ marginBottom: 4 }}>
            • {item}
          </Text>
        ))
      )}
    </View>
  );
}

/**
 * 识别结果页：解释区块为必展示内容，不允许仅渲染候选列表。
 */
export function RecognitionResultScreen({ result }: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>识别结果</Text>

      <Section title="命中原因" items={result.explanation.why_matched} />
      <Section title="质量标记" items={result.explanation.quality_flags} />
      <Section title="建议下一步" items={result.explanation.recommended_next_steps} />

      <View>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>候选列表</Text>
        {result.candidates.map((candidate) => (
          <Text key={candidate.id}>
            {candidate.label} ({candidate.score.toFixed(2)})
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
