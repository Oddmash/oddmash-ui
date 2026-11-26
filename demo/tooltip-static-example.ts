export const staticTooltipHeading = 'Static HTML tooltip';
export const staticTooltipUsage = 'Load the package stylesheet. In a package-aware build, import the controller, attach it to the native trigger and hidden panel, and call destroy before removing or replacing the elements.';
export const staticTooltipCode = `<a id="reference" href="/guide">Guide</a>
<span id="reference-tip" class="om-tooltip" role="tooltip" hidden>
  Open the original reference
</span>

<script type="module">
  import { mountTooltip } from '@oddmash/ui/tooltip-controller';
  import '@oddmash/ui/styles.css';

  const trigger = document.getElementById('reference');
  const panel = document.getElementById('reference-tip');
  const controller = mountTooltip(trigger, panel);

  const dispose = () => controller.destroy();
</script>`;
