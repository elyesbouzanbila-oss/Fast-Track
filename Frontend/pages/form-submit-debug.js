    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearStatus();

      const t = pageTranslations[currentLang] || pageTranslations.en;

      const category = document.getElementById('bugCategory').value;
      const impact = document.getElementById('bugImpact').value;
      const title = document.getElementById('bugTitle').value.trim();
      const steps = document.getElementById('bugSteps').value.trim();
      const expected = document.getElementById('bugExpected').value.trim();
      const actual = document.getElementById('bugActual').value.trim();

      if (!category || !impact || !title || !steps || !expected || !actual) {
        setStatus(t.requiredError, true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = t.submitting;

      try {
        const description = buildDescription();
        const bugPayload = {
          category,
          impact,
          title,
          steps,
          expected_behavior: expected,
          actual_behavior: actual,
          extra_details: bugExtraInput ? bugExtraInput.value.trim() : '',
          description,
          source_page: window.location.pathname,
        };
        
        console.log('[BUG FORM] Submitting bug:', bugPayload);
        
        const response = await navigationAPI.reportBug(bugPayload);
        
        console.log('[BUG FORM] Response:', response);
        
        if (response.success) {
          setStatus(t.success);
          form.reset();
          console.log('[BUG FORM] Bug submitted successfully');
        } else {
          throw new Error(response.error || 'Unknown error');
        }
      } catch (error) {
        console.error('[BUG FORM] Error:', error);
        
        if (error?.status === 401) {
          navigationAPI.clearToken();
          window.location.href = '../pages/login1.html';
          return;
        }

        const errorMsg = error?.message || t.submitError;
        setStatus(errorMsg, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t.submit;
      }
    });
