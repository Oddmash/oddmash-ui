export const notificationTranslations: Record<string, [string, string, string]> = {
  "Clipboard Button": ["클립보드 버튼","クリップボードボタン","剪贴板按钮"],
  "Toast Provider": ["토스트 프로바이더","トーストプロバイダー","通知提供器"],
  "Copy real text and report the result.": ["실제 텍스트를 복사하고 결과를 알립니다.","実際のテキストをコピーして結果を伝えます。","复制实际文本并反馈结果。"],
  "Pass the exact text and localized labels to ClipboardButton. The copy action runs only from activation and keeps the native button focused. Use announce={false} with an external toast when the same result is announced there.": ["ClipboardButton에 복사할 정확한 텍스트와 현지화된 레이블을 전달하세요. 활성화할 때만 복사가 실행되며 기본 버튼의 포커스가 유지됩니다. 같은 결과를 외부 토스트가 알릴 때는 announce={false}를 사용하세요.","ClipboardButton に正確なテキストと翻訳済みラベルを渡します。操作でのみコピーを実行し、ボタンのフォーカスを維持します。同じ結果を外部トーストで通知する場合は announce={false} を使います。","向 ClipboardButton 传递准确文本和本地化标签。仅在激活时执行复制并保持原生按钮焦点。如果外部通知会播报同一结果，请使用 announce={false}。"],
  "A pre-existing live region announces completed copies and failures. Preserve keyboard activation, provide a manual selection path, and use a text or icon state that does not rely on color alone.": ["미리 렌더링된 라이브 영역이 복사 성공과 실패를 알립니다. 키보드 활성화를 유지하고 수동 선택 방법을 제공하며 색만으로 상태를 표시하지 마세요.","事前に描画されたライブリージョンがコピーの完了と失敗を通知します。キーボード操作を維持し、手動選択の方法を用意して、色だけに頼らず状態を示します。","预先存在的实时区域播报复制成功和失败。保留键盘激活，提供手动选择方法，并使用不依赖颜色的文字或图标状态。"],
  "Manage independent notifications, expiry and dismissal.": ["독립적인 알림, 만료, 닫기를 관리합니다.","独立した通知、有効期限、閉じる操作を管理します。","管理独立通知、过期和关闭。"],
  "Mount ToastProvider once for a product surface, then call showToast from useToast after a real result. A full visible stack queues new notifications until space is available.": ["제품 화면에 ToastProvider를 한 번 렌더링하고 실제 결과가 나온 뒤 useToast의 showToast를 호출하세요. 표시 중인 알림이 가득 차면 자리가 생길 때까지 새 알림이 대기합니다.","製品の画面に ToastProvider を一度配置し、実際の結果の後に useToast の showToast を呼び出します。表示枠が埋まると空きができるまで新しい通知を待機させます。","在产品界面中挂载一次 ToastProvider，实际结果出现后调用 useToast 的 showToast。可见通知已满时，新通知排队等待空位。"],
  "Show confirmations politely and errors as alerts, without moving focus on arrival. Expiry pauses during hover or focus. Dismissal restores focus to a remaining notification or the original control.": ["성공 확인은 일반 알림으로, 오류는 경고로 알리되 표시 시 포커스를 옮기지 않습니다. 호버 또는 포커스 중에는 만료를 일시 중지하고 닫으면 남은 알림이나 기존 컨트롤로 포커스를 복원합니다.","確認は穏やかに、エラーは警告として通知し、表示時にフォーカスを移動しません。ホバーまたはフォーカス中は期限を一時停止し、閉じると残った通知または元の操作にフォーカスを戻します。","成功使用礼貌通知，错误使用警报，出现时不移动焦点。悬停或聚焦期间暂停过期，关闭后将焦点恢复到剩余通知或原控件。"],
  "Clipboard example code": ["클립보드 예제 코드","クリップボードの例のコード","剪贴板示例代码"],
  "Copying code": ["코드 복사 중","コードをコピー中","正在复制代码"],
  "Show saved notification": ["저장 성공 알림 보기","保存完了通知を表示","显示保存成功通知"],
  "Show error notification": ["오류 알림 보기","エラー通知を表示","显示错误通知"],
};
