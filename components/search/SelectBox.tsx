export default function SelectBox() {
  return (
    <select name='searchEngines' className='h-full rounded-l-md px-2 text-gray-400'>
      <option>Google</option>
      <option>Naver</option>
      <option>Daum</option>
      <option>MDN</option>
      <option>CanIUse</option>
      <option>GitHub</option>
    </select>
  );
}