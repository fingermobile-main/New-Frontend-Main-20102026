/* eslint-disable no-console */
// Browser-side CSS injection diagnostic tool
// Run this in browser console at http://localhost:3001/login

(function diagnoseCSSInjection() {
  console.log('🔍 Starting CSS Injection Diagnosis...\n');
  
  // 1. Check for <style> tags
  const styleTags = document.querySelectorAll('style');
  console.log(`📊 Found ${styleTags.length} <style> tags in DOM`);
  
  let tailwindFound = false;
  let totalCssRules = 0;
  
  styleTags.forEach((tag, index) => {
    const cssText = tag.textContent || '';
    const ruleCount = (cssText.match(/}/g) || []).length;
    totalCssRules += ruleCount;
    
    // Check for Tailwind-specific markers
    if (cssText.includes('--tw-') || cssText.includes('min-h-screen') || cssText.includes('bg-gradient')) {
      console.log(`✅ Style tag #${index}: Contains Tailwind CSS (${ruleCount} rules)`);
      tailwindFound = true;
      
      // Show sample of Tailwind classes
      const sampleClasses = cssText.match(/\.[a-z-]+/g)?.slice(0, 10) || [];
      console.log('   Sample classes:', sampleClasses.join(', '));
    } else if (ruleCount > 0) {
      console.log(`ℹ️  Style tag #${index}: Regular CSS (${ruleCount} rules)`);
    }
  });
  
  // 2. Check computed styles on Login page elements
  console.log('\n🎯 Checking Login Page Element Styles...');
  const loginContainer = document.querySelector('[class*="min-h-screen"]') || 
                         document.querySelector('[class*="bg-gradient"]') ||
                         document.body;
  
  if (loginContainer) {
    const computedStyle = window.getComputedStyle(loginContainer);
    console.log('Element found:', loginContainer.tagName);
    console.log('Computed background:', computedStyle.background);
    console.log('Computed min-height:', computedStyle.minHeight);
    console.log('Computed display:', computedStyle.display);
    
    // Check if Tailwind classes are actually applied
    const hasGradient = computedStyle.background.includes('gradient') || 
                       computedStyle.backgroundImage.includes('gradient');
    const hasMinHeight = computedStyle.minHeight !== '0px' && computedStyle.minHeight !== 'none';
    
    if (hasGradient) {
      console.log('✅ Gradient background IS applied');
    } else {
      console.log('❌ Gradient background NOT applied - Tailwind CSS not working!');
    }
    
    if (hasMinHeight) {
      console.log('✅ Min-height IS applied');
    } else {
      console.log('❌ Min-height NOT applied');
    }
  } else {
    console.log('❌ Could not find Login page container element');
  }
  
  // 3. Check for CSS loading errors
  console.log('\n⚠️  Checking for CSS-related errors...');
  const performanceEntries = performance.getEntriesByType('resource');
  const cssResources = performanceEntries.filter(entry => entry.name.endsWith('.css'));
  
  if (cssResources.length > 0) {
    console.log(`📦 Found ${cssResources.length} CSS resource(s) loaded:`);
    cssResources.forEach(resource => {
      console.log(`   - ${resource.name} (${Math.round(resource.duration)}ms)`);
    });
  } else {
    console.log('ℹ️  No separate CSS files loaded (expected with style-loader injection)');
  }
  
  // 4. Final verdict
  console.log('\n🏁 DIAGNOSIS RESULT:');
  console.log('─'.repeat(50));
  
  if (tailwindFound) {
    console.log('✅ Tailwind CSS IS being injected into the DOM');
    console.log('   If styles still don\'t appear, check:');
    console.log('   - Browser zoom level (should be 100%)');
    console.log('   - Viewport size (try resizing window)');
    console.log('   - Conflicting global styles');
    console.log('   - CSS specificity issues');
  } else if (totalCssRules > 0) {
    console.log('⚠️  CSS is injected but Tailwind utilities are MISSING');
    console.log('   Possible causes:');
    console.log('   - Tailwind JIT not scanning your source files');
    console.log('   - PostCSS configuration error');
    console.log('   - tailwind.config.js content paths incorrect');
  } else {
    console.log('❌ NO CSS is being injected at all!');
    console.log('   Critical issues:');
    console.log('   - index.css import may be failing');
    console.log('   - Webpack CSS loaders not configured properly');
    console.log('   - Module resolution error for .css files');
  }
  
  console.log('─'.repeat(50));
  
  return {
    styleTags: styleTags.length,
    tailwindFound,
    totalCssRules,
    cssResources: cssResources.length
  };
})();
